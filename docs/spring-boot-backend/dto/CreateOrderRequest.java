package com.janesjeans.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class CreateOrderRequest {

    @NotEmpty(message = "Order must contain at least one item")
    @Valid
    private List<OrderItemRequest> items;

    @NotNull(message = "Shipment details are required")
    @Valid
    private ShipmentDetailsRequest shipmentDetails;

    @NotNull(message = "Payment information is required")
    @Valid
    private PaymentRequest payment;
}
