package com.janesjeans.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PaymentRequest {

    @NotBlank(message = "Payment type is required")
    private String type; // "card" or "bkash"

    @NotNull(message = "Payment status is required")
    private String status; // "SUCCESS", "PENDING", "FAILED"

    // Optional fields for card payment
    private String cardLast4;

    // Optional fields for bKash
    private String bkashNumber;
    private String transactionId;
}
