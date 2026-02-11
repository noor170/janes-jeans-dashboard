package com.janesjeans.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.janesjeans.api.entity.Customer;
import com.janesjeans.api.service.CustomerService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.Arrays;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class CustomerControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private CustomerService customerService;

    private Customer createMockCustomer(String id, String name) {
        Customer c = new Customer();
        c.setId(id);
        c.setName(name);
        c.setEmail(name.toLowerCase().replace(" ", "") + "@test.com");
        c.setPhone("+880 1234567890");
        c.setAddress("123 Test St");
        c.setStatus("active");
        c.setTotalOrders(5);
        c.setTotalSpent(new BigDecimal("500.00"));
        return c;
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getAllCustomers_shouldReturnList() throws Exception {
        when(customerService.getAllCustomers()).thenReturn(Arrays.asList(
                createMockCustomer("c1", "Alice"),
                createMockCustomer("c2", "Bob")
        ));

        mockMvc.perform(get("/api/customers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].name").value("Alice"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createCustomer_shouldReturnCreated() throws Exception {
        Customer customer = createMockCustomer("c-new", "Charlie");
        when(customerService.createCustomer(any(Customer.class))).thenReturn(customer);

        mockMvc.perform(post("/api/customers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(customer)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Charlie"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void deleteCustomer_shouldReturn204() throws Exception {
        doNothing().when(customerService).deleteCustomer("c1");

        mockMvc.perform(delete("/api/customers/c1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void getCustomers_shouldReturn401WhenUnauthenticated() throws Exception {
        mockMvc.perform(get("/api/customers"))
                .andExpect(status().isUnauthorized());
    }
}
