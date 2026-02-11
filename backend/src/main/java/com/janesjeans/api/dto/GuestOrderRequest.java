package com.janesjeans.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Schema(description = "Guest checkout order request")
public class GuestOrderRequest {

    @Schema(description = "Cart items")
    private List<GuestOrderItem> items;

    @Schema(description = "Shipping details")
    private ShipmentInfo shipmentDetails;

    @Schema(description = "Payment info")
    private PaymentInfo payment;

    @Schema(description = "Order total", example = "149.99")
    private BigDecimal totalAmount;

    @Data
    @Schema(description = "Single cart item")
    public static class GuestOrderItem {
        @Schema(description = "Product ID", example = "abc-123")
        private String productId;
        @Schema(description = "Product name", example = "Slim Fit Dark Wash")
        private String productName;
        @Schema(description = "Quantity", example = "2")
        private int quantity;
        @Schema(description = "Size", example = "32")
        private String size;
        @Schema(description = "Unit price", example = "79.99")
        private BigDecimal price;
    }

    @Data
    @Schema(description = "Shipping information")
    public static class ShipmentInfo {
        @Schema(example = "Jane Doe")
        private String name;
        @Schema(example = "jane@example.com")
        private String email;
        @Schema(example = "+1234567890")
        private String phone;
        @Schema(example = "123 Main St")
        private String address;
        @Schema(example = "New York")
        private String city;
        @Schema(example = "10001")
        private String postalCode;
    }

    @Data
    @Schema(description = "Payment information")
    public static class PaymentInfo {
        @Schema(description = "Payment method", example = "credit_card")
        private String type;
        @Schema(description = "Payment status", example = "completed")
        private String status;
    }
}
