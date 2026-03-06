package com.janesjeans.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.janesjeans.api.dto.GuestOrderRequest;
import com.janesjeans.api.entity.Product;
import com.janesjeans.api.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.http.MediaType;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.timeout;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = {
    "spring.liquibase.enabled=false",
    "spring.jpa.hibernate.ddl-auto=create-drop",
    "spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;MODE=MySQL",
    "spring.datasource.driver-class-name=org.h2.Driver",
    "spring.datasource.username=sa",
    "spring.datasource.password=",
    "management.health.mail.enabled=false",
    "spring.profiles.active=test"
})
@AutoConfigureMockMvc
public class EmailConfirmationIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ProductRepository productRepository;

    @MockBean
    private com.janesjeans.api.service.EmailService emailService;

    @Test
    void orderConfirm_shouldTriggerEmailSend() throws Exception {
        // create product
        Product p = new Product();
        p.setName("Email Jeans");
        p.setFit("Regular");
        p.setGender("Unisex");
        p.setSize("M");
        p.setPrice(new BigDecimal("39.99"));
        p.setStockLevel(5);
        p = productRepository.save(p);

        GuestOrderRequest req = new GuestOrderRequest();
        GuestOrderRequest.GuestOrderItem item = new GuestOrderRequest.GuestOrderItem();
        item.setProductId(p.getId());
        item.setProductName(p.getName());
        item.setQuantity(1);
        item.setSize(p.getSize());
        item.setPrice(p.getPrice());
        req.setItems(java.util.List.of(item));

        GuestOrderRequest.ShipmentInfo ship = new GuestOrderRequest.ShipmentInfo();
        ship.setName("Bob");
        ship.setEmail("bob@example.com");
        ship.setPhone("+100");
        ship.setAddress("10 Example St");
        ship.setCity("City");
        ship.setPostalCode("00000");
        req.setShipmentDetails(ship);

        GuestOrderRequest.PaymentInfo pay = new GuestOrderRequest.PaymentInfo();
        pay.setType("CARD");
        pay.setStatus("SUCCESS");
        req.setPayment(pay);

        req.setTotalAmount(p.getPrice());

        // EmailService is mocked, so calls are recorded but no email is sent
        mockMvc.perform(post("/api/shop/orders/confirm")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated());

        // verify EmailService was asked to send the confirmation
        org.mockito.Mockito.verify(emailService, timeout(2000)).sendOrderConfirmationAsync(org.mockito.ArgumentMatchers.any(), org.mockito.ArgumentMatchers.anyString());
    }
}
