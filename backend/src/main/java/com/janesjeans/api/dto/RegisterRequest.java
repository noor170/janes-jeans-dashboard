package com.janesjeans.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(description = "New user registration request")
public class RegisterRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Schema(description = "User email", example = "jane@example.com")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    @Schema(description = "Password (min 8 chars)", example = "securePass123")
    private String password;

    @NotBlank(message = "First name is required")
    @Schema(description = "First name", example = "Jane")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Schema(description = "Last name", example = "Doe")
    private String lastName;
}
