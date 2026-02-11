package com.janesjeans.api.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class GuestOrderRequest {

    private List<GuestOrderItem> items;
    private ShipmentInfo shipmentDetails;
    private PaymentInfo payment;
    private BigDecimal totalAmount;

    @Data
    public static class GuestOrderItem {
        private String productId;
        private String productName;
        private int quantity;
        private String size;
        private BigDecimal price;
    }

    @Data
    public static class ShipmentInfo {
        private String name;
        private String email;
        private String phone;
        private String address;
        private String city;
        private String postalCode;
    }

    @Data
    public static class PaymentInfo {
        private String type;
        private String status;
    }
}
