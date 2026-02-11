package com.janesjeans.api.controller;

import com.janesjeans.api.entity.ShippingVendor;
import com.janesjeans.api.service.ShippingVendorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vendors")
@RequiredArgsConstructor
@Tag(name = "Shipping Vendors", description = "Shipping vendor management (authenticated)")
@SecurityRequirement(name = "bearerAuth")
public class ShippingVendorController {

    private final ShippingVendorService vendorService;

    @Operation(summary = "List all vendors")
    @GetMapping
    public ResponseEntity<List<ShippingVendor>> getAllVendors() {
        return ResponseEntity.ok(vendorService.getAllVendors());
    }

    @Operation(summary = "Get vendor by ID")
    @GetMapping("/{id}")
    public ResponseEntity<ShippingVendor> getVendorById(@PathVariable String id) {
        return ResponseEntity.ok(vendorService.getVendorById(id));
    }

    @Operation(summary = "Create a vendor")
    @PostMapping
    public ResponseEntity<ShippingVendor> createVendor(@RequestBody ShippingVendor vendor) {
        return ResponseEntity.ok(vendorService.createVendor(vendor));
    }

    @Operation(summary = "Update a vendor")
    @PutMapping("/{id}")
    public ResponseEntity<ShippingVendor> updateVendor(@PathVariable String id, @RequestBody ShippingVendor vendor) {
        return ResponseEntity.ok(vendorService.updateVendor(id, vendor));
    }

    @Operation(summary = "Delete a vendor")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVendor(@PathVariable String id) {
        vendorService.deleteVendor(id);
        return ResponseEntity.ok().build();
    }
}
