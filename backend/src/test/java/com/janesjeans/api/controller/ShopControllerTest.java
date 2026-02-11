package com.janesjeans.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.janesjeans.api.dto.GuestOrderRequest;
import com.janesjeans.api.entity.Order;
import com.janesjeans.api.entity.Product;
import com.janesjeans.api.service.EmailService;
import com.janesjeans.api.service.OrderService;
import com.janesjeans.api.service.ProductService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ShopControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private ProductService productService;

    @MockitoBean
    private OrderService orderService;

    @MockitoBean
    private EmailService emailService;

    private Product createMockProduct(String id, String name, String gender, String fit, String size, int stock) {
        Product p = new Product();
        p.setId(id);
        p.setName(name);
        p.setGender(gender);
        p.setFit(fit);
        p.setSize(size);
        p.setWash("Dark Wash");
        p.setPrice(new BigDecimal("89.99"));
        p.setStockLevel(stock);
        p.setImageUrl("/images/products/test.jpg");
        return p;
    }

    @Test
    void getShopProducts_shouldReturnGroupedProducts() throws Exception {
        List<Product> products = Arrays.asList(
                createMockProduct("p1", "Slim Fit Dark Wash", "Men", "Slim", "30", 25),
                createMockProduct("p2", "Slim Fit Dark Wash", "Men", "Slim", "32", 15),
                createMockProduct("p3", "Relaxed Boyfriend", "Women", "Relaxed", "28", 20)
        );
        when(productService.getAllProducts()).thenReturn(products);

        mockMvc.perform(get("/api/shop/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].name").value("Slim Fit Dark Wash"))
                .andExpect(jsonPath("$[0].sizes.length()").value(2));
    }

    @Test
    void getShopProducts_withCategoryFilter() throws Exception {
        List<Product> products = Arrays.asList(
                createMockProduct("p1", "Slim Jeans", "Men", "Slim", "32", 10)
        );
        when(productService.getAllProducts()).thenReturn(products);

        mockMvc.perform(get("/api/shop/products").param("category", "jeans"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].category").value("jeans"));
    }

    @Test
    void getShopProduct_shouldReturnSingleProduct() throws Exception {
        Product product = createMockProduct("p1", "Slim Fit", "Men", "Slim", "32", 10);
        when(productService.getProductById("p1")).thenReturn(product);
        when(productService.getAllProducts()).thenReturn(List.of(product));

        mockMvc.perform(get("/api/shop/products/p1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Slim Fit"))
                .andExpect(jsonPath("$.inStock").value(true));
    }

    @Test
    void checkStock_shouldReturnAvailableWhenInStock() throws Exception {
        Product product = createMockProduct("p1", "Jeans", "Men", "Slim", "32", 50);
        when(productService.getProductById("p1")).thenReturn(product);

        List<GuestOrderRequest.GuestOrderItem> items = new ArrayList<>();
        GuestOrderRequest.GuestOrderItem item = new GuestOrderRequest.GuestOrderItem();
        item.setProductId("p1");
        item.setProductName("Jeans");
        item.setQuantity(2);
        items.add(item);

        mockMvc.perform(post("/api/shop/check-stock")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(items)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.available").value(true))
                .andExpect(jsonPath("$.issues.length()").value(0));
    }

    @Test
    void checkStock_shouldReturnIssuesWhenOutOfStock() throws Exception {
        Product product = createMockProduct("p1", "Jeans", "Men", "Slim", "32", 1);
        when(productService.getProductById("p1")).thenReturn(product);

        List<GuestOrderRequest.GuestOrderItem> items = new ArrayList<>();
        GuestOrderRequest.GuestOrderItem item = new GuestOrderRequest.GuestOrderItem();
        item.setProductId("p1");
        item.setProductName("Jeans");
        item.setQuantity(5);
        items.add(item);

        mockMvc.perform(post("/api/shop/check-stock")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(items)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.available").value(false))
                .andExpect(jsonPath("$.issues[0].availableStock").value(1));
    }

    @Test
    void createGuestOrder_shouldReturn201OnSuccess() throws Exception {
        Product product = createMockProduct("p1", "Slim Jeans", "Men", "Slim", "32", 10);
        when(productService.getProductById("p1")).thenReturn(product);
        when(productService.updateProduct(eq("p1"), any())).thenReturn(product);

        String orderId = UUID.randomUUID().toString();
        Order savedOrder = Order.builder()
                .id(orderId)
                .customerName("John Doe")
                .customerEmail("john@test.com")
                .status("Pending")
                .totalAmount(new BigDecimal("89.99"))
                .createdAt(LocalDateTime.now())
                .build();
        when(orderService.createOrder(any(Order.class))).thenReturn(savedOrder);

        GuestOrderRequest request = new GuestOrderRequest();
        List<GuestOrderRequest.GuestOrderItem> items = new ArrayList<>();
        GuestOrderRequest.GuestOrderItem item = new GuestOrderRequest.GuestOrderItem();
        item.setProductId("p1");
        item.setProductName("Slim Jeans");
        item.setQuantity(1);
        item.setSize("32");
        item.setPrice(new BigDecimal("89.99"));
        items.add(item);
        request.setItems(items);

        GuestOrderRequest.ShipmentInfo shipment = new GuestOrderRequest.ShipmentInfo();
        shipment.setName("John Doe");
        shipment.setEmail("john@test.com");
        shipment.setPhone("+880 1234567890");
        shipment.setAddress("123 Main St");
        shipment.setCity("Dhaka");
        shipment.setPostalCode("1200");
        request.setShipmentDetails(shipment);

        GuestOrderRequest.PaymentInfo payment = new GuestOrderRequest.PaymentInfo();
        payment.setType("CARD");
        payment.setStatus("SUCCESS");
        request.setPayment(payment);
        request.setTotalAmount(new BigDecimal("89.99"));

        mockMvc.perform(post("/api/shop/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.customerName").value("John Doe"))
                .andExpect(jsonPath("$.status").value("Pending"))
                .andExpect(jsonPath("$.orderNumber").exists());
    }

    @Test
    void createGuestOrder_shouldReturn409WhenOutOfStock() throws Exception {
        Product product = createMockProduct("p1", "Slim Jeans", "Men", "Slim", "32", 0);
        when(productService.getProductById("p1")).thenReturn(product);

        GuestOrderRequest request = new GuestOrderRequest();
        List<GuestOrderRequest.GuestOrderItem> items = new ArrayList<>();
        GuestOrderRequest.GuestOrderItem item = new GuestOrderRequest.GuestOrderItem();
        item.setProductId("p1");
        item.setProductName("Slim Jeans");
        item.setQuantity(1);
        item.setSize("32");
        item.setPrice(new BigDecimal("89.99"));
        items.add(item);
        request.setItems(items);

        GuestOrderRequest.ShipmentInfo shipment = new GuestOrderRequest.ShipmentInfo();
        shipment.setName("Jane");
        shipment.setEmail("jane@test.com");
        shipment.setPhone("123");
        shipment.setAddress("Addr");
        shipment.setCity("City");
        shipment.setPostalCode("1000");
        request.setShipmentDetails(shipment);

        GuestOrderRequest.PaymentInfo payment = new GuestOrderRequest.PaymentInfo();
        payment.setType("CARD");
        payment.setStatus("SUCCESS");
        request.setPayment(payment);
        request.setTotalAmount(new BigDecimal("89.99"));

        mockMvc.perform(post("/api/shop/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("Some items are out of stock"));
    }
}
