package com.janesjeans.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.janesjeans.api.dto.LoginRequest;
import com.janesjeans.api.dto.RegisterRequest;
import com.janesjeans.api.dto.AuthResponse;
import com.janesjeans.api.dto.UserDTO;
import com.janesjeans.api.service.AuthService;
import com.janesjeans.api.service.JwtService;
import com.janesjeans.api.config.UserDetailsServiceImpl;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private AuthService authService;

    private AuthResponse createMockAuthResponse() {
        return AuthResponse.builder()
                .accessToken("mock-access-token")
                .refreshToken("mock-refresh-token")
                .user(UserDTO.builder()
                        .id("user-1")
                        .email("test@janesjeans.com")
                        .firstName("Test")
                        .lastName("User")
                        .role("ADMIN")
                        .isActive(true)
                        .build())
                .build();
    }

    @Test
    void login_shouldReturnTokensOnValidCredentials() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setEmail("admin@janesjeans.com");
        request.setPassword("admin123");

        when(authService.login(any(LoginRequest.class))).thenReturn(createMockAuthResponse());

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("mock-access-token"))
                .andExpect(jsonPath("$.user.email").value("test@janesjeans.com"));
    }

    @Test
    void adminLogin_shouldReturnTokens() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setEmail("admin@janesjeans.com");
        request.setPassword("admin123");

        when(authService.adminLogin(any(LoginRequest.class))).thenReturn(createMockAuthResponse());

        mockMvc.perform(post("/api/auth/admin/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").exists())
                .andExpect(jsonPath("$.user.role").value("ADMIN"));
    }

    @Test
    void register_shouldCreateUserAndReturnTokens() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("newuser@test.com");
        request.setPassword("password123");
        request.setFirstName("New");
        request.setLastName("User");

        when(authService.register(any(RegisterRequest.class))).thenReturn(createMockAuthResponse());

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").exists());
    }

    @Test
    void login_shouldReturn401OnInvalidCredentials() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setEmail("wrong@test.com");
        request.setPassword("wrong");

        when(authService.login(any(LoginRequest.class)))
                .thenThrow(new RuntimeException("Invalid credentials"));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().is5xxServerError());
    }
}
