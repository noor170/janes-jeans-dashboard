package com.janesjeans.api.controller;

import com.janesjeans.api.entity.ShippingVendor;
import com.janesjeans.api.service.ShippingVendorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vendors")
@RequiredArgsConstructor
public class ShippingVendorController {

    private final ShippingVendorService vendorService;

    @GetMapping
    public ResponseEntity<List<ShippingVendor>> getAllVendors() {
        return ResponseEntity.ok(vendorService.getAllVendors());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ShippingVendor> getVendorById(@PathVariable String id) {
        return ResponseEntity.ok(vendorService.getVendorById(id));
    }

    @PostMapping
    public ResponseEntity<ShippingVendor> createVendor(@RequestBody ShippingVendor vendor) {
        return ResponseEntity.ok(vendorService.createVendor(vendor));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ShippingVendor> updateVendor(@PathVariable String id, @RequestBody ShippingVendor vendor) {
        return ResponseEntity.ok(vendorService.updateVendor(id, vendor));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVendor(@PathVariable String id) {
        vendorService.deleteVendor(id);
        return ResponseEntity.ok().build();
    }
}
