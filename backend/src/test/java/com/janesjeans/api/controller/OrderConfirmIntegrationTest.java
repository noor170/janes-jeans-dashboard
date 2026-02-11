package com.janesjeans.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.janesjeans.api.dto.GuestOrderRequest;
import com.janesjeans.api.entity.Payment;
import com.janesjeans.api.entity.Product;
import com.janesjeans.api.entity.Shipment;
import com.janesjeans.api.repository.OrderRepository;
import com.janesjeans.api.repository.PaymentRepository;
import com.janesjeans.api.repository.ProductRepository;
import com.janesjeans.api.repository.ShipmentRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = {
    "spring.liquibase.enabled=false",
    "spring.jpa.hibernate.ddl-auto=create-drop",
    "spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;MODE=MySQL",
    "spring.datasource.driver-class-name=org.h2.Driver",
    "spring.datasource.username=sa",
    "spring.datasource.password=",
    "spring.profiles.active=test"
})
@AutoConfigureMockMvc
class OrderConfirmIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private ShipmentRepository shipmentRepository;

    @Test
    @Transactional
    void confirmOrder_shouldPersistOrderPaymentAndShipment() throws Exception {
        // prepare product
        Product p = new Product();
        p.setName("Test Jeans");
        p.setFit("Slim");
        p.setGender("Men");
        p.setSize("32");
        p.setPrice(new BigDecimal("59.99"));
        p.setStockLevel(10);
        p = productRepository.save(p);

        // build request
        GuestOrderRequest req = new GuestOrderRequest();
        List<GuestOrderRequest.GuestOrderItem> items = new ArrayList<>();
        GuestOrderRequest.GuestOrderItem it = new GuestOrderRequest.GuestOrderItem();
        it.setProductId(p.getId());
        it.setProductName(p.getName());
        it.setQuantity(2);
        it.setSize(p.getSize());
        it.setPrice(p.getPrice());
        items.add(it);
        req.setItems(items);

        GuestOrderRequest.ShipmentInfo ship = new GuestOrderRequest.ShipmentInfo();
        ship.setName("Alice");
        ship.setEmail("alice@test.com");
        ship.setPhone("+100");
        ship.setAddress("1 Test Ave");
        ship.setCity("Testville");
        ship.setPostalCode("12345");
        req.setShipmentDetails(ship);

        GuestOrderRequest.PaymentInfo pay = new GuestOrderRequest.PaymentInfo();
        pay.setType("CARD");
        pay.setStatus("SUCCESS");
        req.setPayment(pay);

        req.setTotalAmount(p.getPrice().multiply(new BigDecimal(it.getQuantity())));

        // call endpoint
        String resp = mockMvc.perform(post("/api/shop/orders/confirm")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        // parse id from response
        var node = objectMapper.readTree(resp);
        String orderId = node.get("id").asText();

        // verify order persisted
        var orderOpt = orderRepository.findById(orderId);
        assertThat(orderOpt).isPresent();
        var order = orderOpt.get();
        assertThat(order.getTotalAmount()).isEqualByComparingTo(req.getTotalAmount());
        assertThat(order.getShippingAddress()).isNotBlank();
        assertThat(order.getOrderDate()).isNotNull();

        // verify payment persisted
        List<Payment> payments = paymentRepository.findByOrderId(orderId);
        assertThat(payments).hasSize(1);
        Payment payment = payments.get(0);
        assertThat(payment.getAmount()).isEqualByComparingTo(req.getTotalAmount());
        assertThat(payment.getMethod()).isEqualTo("CARD");

        // verify shipment persisted
        var shipOpt = shipmentRepository.findByOrderId(orderId);
        assertThat(shipOpt).isPresent();
        Shipment shipment = shipOpt.get();
        assertThat(shipment.getShippingAddress()).contains("Test Ave");
    }
}
