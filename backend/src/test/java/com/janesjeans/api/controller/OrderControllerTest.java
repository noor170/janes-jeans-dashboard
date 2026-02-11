package com.janesjeans.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.janesjeans.api.entity.Order;
import com.janesjeans.api.service.OrderService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.ArrayList;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private OrderService orderService;

    private Order createMockOrder(String id, String status) {
        return Order.builder()
                .id(id)
                .customerName("Test Customer")
                .customerEmail("test@test.com")
                .status(status)
                .totalAmount(new BigDecimal("149.99"))
                .shippingAddress("123 Test St")
                .createdAt(LocalDateTime.now())
                .items(new ArrayList<>())
                .build();
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getAllOrders_shouldReturnOrders() throws Exception {
        when(orderService.getAllOrders()).thenReturn(Arrays.asList(
                createMockOrder("o1", "Pending"),
                createMockOrder("o2", "Shipped")
        ));

        mockMvc.perform(get("/api/orders"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getOrderById_shouldReturnOrder() throws Exception {
        when(orderService.getOrderById("o1")).thenReturn(createMockOrder("o1", "Pending"));

        mockMvc.perform(get("/api/orders/o1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.customerName").value("Test Customer"))
                .andExpect(jsonPath("$.status").value("Pending"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void updateOrderStatus_shouldReturnUpdated() throws Exception {
        Order updated = createMockOrder("o1", "Shipped");
        updated.setShippedDate(LocalDateTime.now());
        when(orderService.updateOrderStatus("o1", "Shipped")).thenReturn(updated);

        mockMvc.perform(put("/api/orders/o1/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"Shipped\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("Shipped"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void deleteOrder_shouldReturn204() throws Exception {
        doNothing().when(orderService).deleteOrder("o1");

        mockMvc.perform(delete("/api/orders/o1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void getOrders_shouldReturn401WhenUnauthenticated() throws Exception {
        mockMvc.perform(get("/api/orders"))
                .andExpect(status().isUnauthorized());
    }
}
