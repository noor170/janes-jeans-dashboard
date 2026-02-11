package com.janesjeans.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Guest order confirmation response")
public class GuestOrderResponse {
    @Schema(description = "Order UUID", example = "a1b2c3d4-e5f6-7890-abcd-ef1234567890")
    private String id;
    @Schema(description = "Human-readable order number", example = "ORD-A1B2C3D4")
    private String orderNumber;
    @Schema(description = "Order status", example = "Pending")
    private String status;
    @Schema(description = "Total amount", example = "149.99")
    private BigDecimal totalAmount;
    @Schema(description = "Customer name", example = "Jane Doe")
    private String customerName;
    @Schema(description = "Customer email", example = "jane@example.com")
    private String customerEmail;
    @Schema(description = "Order creation timestamp")
    private LocalDateTime createdAt;
}
