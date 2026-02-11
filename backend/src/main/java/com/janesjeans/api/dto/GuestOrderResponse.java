package com.janesjeans.api.dto;

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
public class GuestOrderResponse {
    private String id;
    private String orderNumber;
    private String status;
    private BigDecimal totalAmount;
    private String customerName;
    private String customerEmail;
    private LocalDateTime createdAt;
}
