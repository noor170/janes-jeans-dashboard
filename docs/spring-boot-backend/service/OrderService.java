package com.janesjeans.service;

import com.janesjeans.dto.*;
import com.janesjeans.entity.*;
import com.janesjeans.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final EmailService emailService;

    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request) {
        log.info("Creating new order with {} items", request.getItems().size());

        // Create shipment details
        ShipmentDetails shipmentDetails = ShipmentDetails.builder()
                .name(request.getShipmentDetails().getName())
                .email(request.getShipmentDetails().getEmail())
                .phone(request.getShipmentDetails().getPhone())
                .address(request.getShipmentDetails().getAddress())
                .city(request.getShipmentDetails().getCity())
                .postalCode(request.getShipmentDetails().getPostalCode())
                .build();

        // Calculate total
        BigDecimal totalAmount = request.getItems().stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Create order
        Order order = Order.builder()
                .shipmentDetails(shipmentDetails)
                .paymentType(PaymentType.valueOf(request.getPayment().getType().toUpperCase()))
                .paymentStatus(PaymentStatus.valueOf(request.getPayment().getStatus().toUpperCase()))
                .totalAmount(totalAmount)
                .status(OrderStatus.PENDING)
                .build();

        // Add order items
        for (OrderItemRequest itemRequest : request.getItems()) {
            OrderItem item = OrderItem.builder()
                    .productId(itemRequest.getProductId())
                    .productName(itemRequest.getProductName())
                    .size(itemRequest.getSize())
                    .quantity(itemRequest.getQuantity())
                    .price(itemRequest.getPrice())
                    .build();
            order.addItem(item);
        }

        // Save order
        Order savedOrder = orderRepository.save(order);
        log.info("Order created successfully: {}", savedOrder.getOrderNumber());

        // Send confirmation email
        try {
            emailService.sendOrderConfirmation(savedOrder);
        } catch (Exception e) {
            log.error("Failed to send confirmation email for order {}", savedOrder.getOrderNumber(), e);
        }

        return mapToResponse(savedOrder);
    }

    public OrderResponse getOrderByNumber(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderNumber));
        return mapToResponse(order);
    }

    private OrderResponse mapToResponse(Order order) {
        return OrderResponse.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .items(order.getItems().stream()
                        .map(item -> OrderItemResponse.builder()
                                .id(item.getId())
                                .productId(item.getProductId())
                                .productName(item.getProductName())
                                .size(item.getSize())
                                .quantity(item.getQuantity())
                                .price(item.getPrice())
                                .subtotal(item.getSubtotal())
                                .build())
                        .collect(Collectors.toList()))
                .shipmentDetails(ShipmentDetailsResponse.builder()
                        .name(order.getShipmentDetails().getName())
                        .email(order.getShipmentDetails().getEmail())
                        .phone(order.getShipmentDetails().getPhone())
                        .address(order.getShipmentDetails().getAddress())
                        .city(order.getShipmentDetails().getCity())
                        .postalCode(order.getShipmentDetails().getPostalCode())
                        .build())
                .paymentType(order.getPaymentType().name())
                .paymentStatus(order.getPaymentStatus().name())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus().name())
                .createdAt(order.getCreatedAt())
                .build();
    }
}
