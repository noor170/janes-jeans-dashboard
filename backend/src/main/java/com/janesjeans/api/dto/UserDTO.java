package com.janesjeans.api.dto;

import com.janesjeans.api.entity.Role;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "User details (password excluded)")
public class UserDTO {
    @Schema(example = "a1b2c3d4-e5f6-7890-abcd-ef1234567890")
    private String id;
    @Schema(example = "admin@janesjeans.com")
    private String email;
    @Schema(example = "Jane")
    private String firstName;
    @Schema(example = "Admin")
    private String lastName;
    @Schema(example = "ADMIN")
    private Role role;
    @Schema(example = "true")
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
