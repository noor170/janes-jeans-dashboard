package com.janesjeans.api.controller;

import com.janesjeans.api.dto.AuthResponse;
import com.janesjeans.api.dto.LoginRequest;
import com.janesjeans.api.dto.RegisterRequest;
import com.janesjeans.api.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "User registration, login, and token management")
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "Register a new user", description = "Creates a new user account and returns JWT tokens")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Registration successful", content = @Content(schema = @Schema(implementation = AuthResponse.class))),
        @ApiResponse(responseCode = "400", description = "Validation error (invalid email, short password, etc.)", content = @Content),
        @ApiResponse(responseCode = "409", description = "Email already exists", content = @Content)
    })
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @Operation(summary = "User login", description = "Authenticates a user and returns JWT tokens")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Login successful", content = @Content(schema = @Schema(implementation = AuthResponse.class))),
        @ApiResponse(responseCode = "401", description = "Invalid credentials", content = @Content)
    })
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @Operation(summary = "Admin login", description = "Authenticates an admin user and returns JWT tokens")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Admin login successful", content = @Content(schema = @Schema(implementation = AuthResponse.class))),
        @ApiResponse(responseCode = "401", description = "Invalid credentials", content = @Content),
        @ApiResponse(responseCode = "403", description = "User is not an admin", content = @Content)
    })
    @PostMapping("/admin/login")
    public ResponseEntity<AuthResponse> adminLogin(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.adminLogin(request));
    }

    @Operation(summary = "Refresh token", description = "Generates a new access token using a refresh token", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Token refreshed", content = @Content(schema = @Schema(implementation = AuthResponse.class))),
        @ApiResponse(responseCode = "401", description = "Invalid or expired refresh token", content = @Content)
    })
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@RequestHeader("Authorization") String authHeader) {
        String refreshToken = authHeader.substring(7);
        return ResponseEntity.ok(authService.refreshToken(refreshToken));
    }

    @Operation(summary = "Validate token", description = "Validates the current JWT token", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Token is valid"),
        @ApiResponse(responseCode = "401", description = "Token is invalid or expired", content = @Content)
    })
    @GetMapping("/validate")
    public ResponseEntity<Void> validateToken() {
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Health check", description = "Returns auth service health status")
    @ApiResponse(responseCode = "200", description = "Service is healthy")
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Auth service is running");
    }
}
