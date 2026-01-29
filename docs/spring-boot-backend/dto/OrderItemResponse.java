package com.janesjeans.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class OrderItemResponse {

    private String id;
    private String productId;
    private String productName;
    private String size;
    private Integer quantity;
    private BigDecimal price;
    private BigDecimal subtotal;
}
