package com.janesjeans.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class OrderResponse {

    private String id;
    private String orderNumber;
    private List<OrderItemResponse> items;
    private ShipmentDetailsResponse shipmentDetails;
    private String paymentType;
    private String paymentStatus;
    private BigDecimal totalAmount;
    private String status;
    private LocalDateTime createdAt;
}
