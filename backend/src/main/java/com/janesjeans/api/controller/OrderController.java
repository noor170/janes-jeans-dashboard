package com.janesjeans.api.controller;

import com.janesjeans.api.entity.Order;
import com.janesjeans.api.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Tag(name = "Orders", description = "Order management (authenticated)")
@SecurityRequirement(name = "bearerAuth")
public class OrderController {

    private final OrderService orderService;
    private final com.janesjeans.api.service.EmailSender emailSender;

    @Operation(summary = "List all orders")
    @ApiResponse(responseCode = "200", description = "Orders retrieved", content = @Content(array = @ArraySchema(schema = @Schema(implementation = Order.class))))
    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @Operation(summary = "Get order by ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Order found", content = @Content(schema = @Schema(implementation = Order.class))),
        @ApiResponse(responseCode = "404", description = "Order not found", content = @Content)
    })
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable String id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @Operation(summary = "Create an order")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Order created", content = @Content(schema = @Schema(implementation = Order.class))),
        @ApiResponse(responseCode = "400", description = "Invalid order data", content = @Content)
    })
    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        return ResponseEntity.ok(orderService.createOrder(order));
    }

    @Operation(summary = "Update an order")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Order updated", content = @Content(schema = @Schema(implementation = Order.class))),
        @ApiResponse(responseCode = "404", description = "Order not found", content = @Content)
    })
    @PutMapping("/{id}")
    public ResponseEntity<Order> updateOrder(@PathVariable String id, @RequestBody Order order) {
        return ResponseEntity.ok(orderService.updateOrder(id, order));
    }

    @Operation(summary = "Update order status", description = "Body: {\"status\": \"Shipped\"}")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Status updated", content = @Content(schema = @Schema(implementation = Order.class))),
        @ApiResponse(responseCode = "404", description = "Order not found", content = @Content)
    })
    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, body.get("status")));
    }

    @Operation(summary = "Delete an order")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Order deleted"),
        @ApiResponse(responseCode = "404", description = "Order not found", content = @Content)
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable String id) {
        orderService.deleteOrder(id);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Send confirmation email for an order", description = "Triggers an order confirmation email to be sent for the given order id")
    @ApiResponses({
        @ApiResponse(responseCode = "202", description = "Email send accepted"),
        @ApiResponse(responseCode = "404", description = "Order not found", content = @Content)
    })
    @PostMapping("/{id}/confirm-email")
    public ResponseEntity<Void> confirmOrderByEmail(@PathVariable String id) {
        emailSender.confirmOrderByEmail(id);
        return ResponseEntity.accepted().build();
    }
}
