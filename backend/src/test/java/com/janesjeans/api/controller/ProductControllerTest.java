package com.janesjeans.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.janesjeans.api.entity.Product;
import com.janesjeans.api.service.ProductService;
import com.janesjeans.api.service.JwtService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.bean.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ProductService productService;

    private Product createProduct(String id, String name, String gender) {
        Product p = new Product();
        p.setId(id);
        p.setName(name);
        p.setGender(gender);
        p.setFit("Slim");
        p.setSize("32");
        p.setWash("Dark");
        p.setPrice(new BigDecimal("79.99"));
        p.setStockLevel(20);
        return p;
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getAllProducts_shouldReturnProductList() throws Exception {
        List<Product> products = Arrays.asList(
                createProduct("p1", "Slim Dark", "Men"),
                createProduct("p2", "Relaxed Light", "Women")
        );
        when(productService.getAllProducts()).thenReturn(products);

        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].name").value("Slim Dark"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getProductById_shouldReturnProduct() throws Exception {
        Product product = createProduct("p1", "Slim Dark", "Men");
        when(productService.getProductById("p1")).thenReturn(product);

        mockMvc.perform(get("/api/products/p1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Slim Dark"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createProduct_shouldReturn201() throws Exception {
        Product product = createProduct("p-new", "New Jeans", "Men");
        when(productService.createProduct(any(Product.class))).thenReturn(product);

        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(product)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("New Jeans"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void updateProduct_shouldReturnUpdated() throws Exception {
        Product updated = createProduct("p1", "Updated Jeans", "Men");
        when(productService.updateProduct(eq("p1"), any(Product.class))).thenReturn(updated);

        mockMvc.perform(put("/api/products/p1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updated)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Jeans"));
    }

    @Test
    void getProducts_shouldReturn401WhenUnauthenticated() throws Exception {
        mockMvc.perform(get("/api/products"))
                .andExpect(status().isUnauthorized());
    }
}
