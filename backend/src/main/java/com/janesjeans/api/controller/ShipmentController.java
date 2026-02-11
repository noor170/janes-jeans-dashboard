package com.janesjeans.api.controller;

import com.janesjeans.api.entity.Shipment;
import com.janesjeans.api.service.ShipmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/shipments")
@RequiredArgsConstructor
public class ShipmentController {

    private final ShipmentService shipmentService;

    @GetMapping
    public ResponseEntity<List<Shipment>> getAllShipments() {
        return ResponseEntity.ok(shipmentService.getAllShipments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Shipment> getShipmentById(@PathVariable String id) {
        return ResponseEntity.ok(shipmentService.getShipmentById(id));
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<Shipment> getShipmentByOrderId(@PathVariable String orderId) {
        return shipmentService.getShipmentByOrderId(orderId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Shipment> createShipment(@RequestBody Shipment shipment) {
        return ResponseEntity.ok(shipmentService.createShipment(shipment));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Shipment> updateShipment(@PathVariable String id, @RequestBody Shipment shipment) {
        return ResponseEntity.ok(shipmentService.updateShipment(id, shipment));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Shipment> updateShipmentStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(shipmentService.updateShipmentStatus(id, body.get("status")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShipment(@PathVariable String id) {
        shipmentService.deleteShipment(id);
        return ResponseEntity.ok().build();
    }
}
