package com.janesjeans.api.controller;

import com.janesjeans.api.entity.Shipment;
import com.janesjeans.api.service.ShipmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/shipments")
@RequiredArgsConstructor
@Tag(name = "Shipments", description = "Shipment tracking and management (authenticated)")
@SecurityRequirement(name = "bearerAuth")
public class ShipmentController {

    private final ShipmentService shipmentService;

    @Operation(summary = "List all shipments")
    @GetMapping
    public ResponseEntity<List<Shipment>> getAllShipments() {
        return ResponseEntity.ok(shipmentService.getAllShipments());
    }

    @Operation(summary = "Get shipment by ID")
    @GetMapping("/{id}")
    public ResponseEntity<Shipment> getShipmentById(@PathVariable String id) {
        return ResponseEntity.ok(shipmentService.getShipmentById(id));
    }

    @Operation(summary = "Get shipment by order ID")
    @GetMapping("/order/{orderId}")
    public ResponseEntity<Shipment> getShipmentByOrderId(@PathVariable String orderId) {
        return shipmentService.getShipmentByOrderId(orderId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Create a shipment")
    @PostMapping
    public ResponseEntity<Shipment> createShipment(@RequestBody Shipment shipment) {
        return ResponseEntity.ok(shipmentService.createShipment(shipment));
    }

    @Operation(summary = "Update a shipment")
    @PutMapping("/{id}")
    public ResponseEntity<Shipment> updateShipment(@PathVariable String id, @RequestBody Shipment shipment) {
        return ResponseEntity.ok(shipmentService.updateShipment(id, shipment));
    }

    @Operation(summary = "Update shipment status")
    @PutMapping("/{id}/status")
    public ResponseEntity<Shipment> updateShipmentStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(shipmentService.updateShipmentStatus(id, body.get("status")));
    }

    @Operation(summary = "Delete a shipment")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShipment(@PathVariable String id) {
        shipmentService.deleteShipment(id);
        return ResponseEntity.ok().build();
    }
}
