package com.janesjeans.api.controller;

import com.janesjeans.api.entity.ProductReturn;
import com.janesjeans.api.service.ProductReturnService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/returns")
@RequiredArgsConstructor
@Tag(name = "Product Returns", description = "Product return and refund management")
@SecurityRequirement(name = "bearerAuth")
public class ProductReturnController {

    private final ProductReturnService returnService;

    @Operation(summary = "List all returns")
    @GetMapping
    public ResponseEntity<List<ProductReturn>> getAll() {
        return ResponseEntity.ok(returnService.getAll());
    }

    @Operation(summary = "Get return by ID")
    @GetMapping("/{id}")
    public ResponseEntity<ProductReturn> getById(@PathVariable String id) {
        return ResponseEntity.ok(returnService.getById(id));
    }

    @Operation(summary = "Get returns by order ID")
    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<ProductReturn>> getByOrder(@PathVariable String orderId) {
        return ResponseEntity.ok(returnService.getByOrderId(orderId));
    }

    @Operation(summary = "Get returns by status")
    @GetMapping("/status/{status}")
    public ResponseEntity<List<ProductReturn>> getByStatus(@PathVariable String status) {
        return ResponseEntity.ok(returnService.getByStatus(status));
    }

    @Operation(summary = "Create a return request")
    @PostMapping
    public ResponseEntity<ProductReturn> create(@RequestBody ProductReturn productReturn) {
        return ResponseEntity.status(201).body(returnService.create(productReturn));
    }

    @Operation(summary = "Update a return")
    @PutMapping("/{id}")
    public ResponseEntity<ProductReturn> update(@PathVariable String id, @RequestBody ProductReturn productReturn) {
        return ResponseEntity.ok(returnService.update(id, productReturn));
    }

    @Operation(summary = "Approve a return")
    @PostMapping("/{id}/approve")
    public ResponseEntity<ProductReturn> approve(@PathVariable String id) {
        return ResponseEntity.ok(returnService.approve(id));
    }

    @Operation(summary = "Reject a return")
    @PostMapping("/{id}/reject")
    public ResponseEntity<ProductReturn> reject(@PathVariable String id, @RequestBody(required = false) Map<String, String> body) {
        String notes = body != null ? body.get("notes") : null;
        return ResponseEntity.ok(returnService.reject(id, notes));
    }

    @Operation(summary = "Delete a return")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        returnService.delete(id);
        return ResponseEntity.ok().build();
    }
}
