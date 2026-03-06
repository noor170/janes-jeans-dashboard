package com.janesjeans.api.controller;

import com.janesjeans.api.entity.Shipment;
import com.janesjeans.api.service.ShipmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
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
@RequestMapping("/api/shipments")
@RequiredArgsConstructor
@Tag(name = "Shipments", description = "Shipment tracking and management (authenticated)")
@SecurityRequirement(name = "bearerAuth")
public class ShipmentController {

    private final ShipmentService shipmentService;

    @Operation(summary = "List all shipments")
    @ApiResponse(responseCode = "200", description = "Shipments retrieved", content = @Content(array = @ArraySchema(schema = @Schema(implementation = Shipment.class))))
    @GetMapping
    public ResponseEntity<List<Shipment>> getAllShipments() {
        return ResponseEntity.ok(shipmentService.getAllShipments());
    }

    @Operation(summary = "Get shipment by ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Shipment found", content = @Content(schema = @Schema(implementation = Shipment.class))),
        @ApiResponse(responseCode = "404", description = "Shipment not found", content = @Content)
    })
    @GetMapping("/{id}")
    public ResponseEntity<Shipment> getShipmentById(@PathVariable String id) {
        return ResponseEntity.ok(shipmentService.getShipmentById(id));
    }

    @Operation(summary = "Get shipment by order ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Shipment found", content = @Content(schema = @Schema(implementation = Shipment.class))),
        @ApiResponse(responseCode = "404", description = "No shipment for this order", content = @Content)
    })
    @GetMapping("/order/{orderId}")
    public ResponseEntity<Shipment> getShipmentByOrderId(@PathVariable String orderId) {
        return shipmentService.getShipmentByOrderId(orderId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Create a shipment")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Shipment created", content = @Content(schema = @Schema(implementation = Shipment.class))),
        @ApiResponse(responseCode = "400", description = "Invalid data", content = @Content)
    })
    @PostMapping
    public ResponseEntity<Shipment> createShipment(@RequestBody Shipment shipment) {
        return ResponseEntity.ok(shipmentService.createShipment(shipment));
    }

    @Operation(summary = "Update a shipment")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Shipment updated", content = @Content(schema = @Schema(implementation = Shipment.class))),
        @ApiResponse(responseCode = "404", description = "Shipment not found", content = @Content)
    })
    @PutMapping("/{id}")
    public ResponseEntity<Shipment> updateShipment(@PathVariable String id, @RequestBody Shipment shipment) {
        return ResponseEntity.ok(shipmentService.updateShipment(id, shipment));
    }

    @Operation(summary = "Update shipment status", description = "Body: {\"status\": \"shipped\"}")
    @io.swagger.v3.oas.annotations.parameters.RequestBody(content = @Content(examples = @ExampleObject(value = "{\"status\":\"shipped\"}")))
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Status updated", content = @Content(schema = @Schema(implementation = Shipment.class))),
        @ApiResponse(responseCode = "404", description = "Shipment not found", content = @Content)
    })
    @PutMapping("/{id}/status")
    public ResponseEntity<Shipment> updateShipmentStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(shipmentService.updateShipmentStatus(id, body.get("status")));
    }

    @Operation(summary = "Delete a shipment")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Shipment deleted"),
        @ApiResponse(responseCode = "404", description = "Shipment not found", content = @Content)
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShipment(@PathVariable String id) {
        shipmentService.deleteShipment(id);
        return ResponseEntity.ok().build();
    }
}
