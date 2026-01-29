package com.janesjeans.controller;

import com.janesjeans.dto.CreateOrderRequest;
import com.janesjeans.dto.OrderResponse;
import com.janesjeans.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;

    /**
     * Create a new guest order
     * POST /api/orders
     * 
     * @param request Order details including items, shipping, and payment info
     * @return Created order with order number
     */
    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        log.info("Received order request with {} items", request.getItems().size());
        OrderResponse order = orderService.createOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(order);
    }

    /**
     * Get order by order number
     * GET /api/orders/{orderNumber}
     * 
     * @param orderNumber The unique order number
     * @return Order details
     */
    @GetMapping("/{orderNumber}")
    public ResponseEntity<OrderResponse> getOrder(@PathVariable String orderNumber) {
        OrderResponse order = orderService.getOrderByNumber(orderNumber);
        return ResponseEntity.ok(order);
    }
}
