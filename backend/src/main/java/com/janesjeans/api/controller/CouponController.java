package com.janesjeans.api.controller;

import com.janesjeans.api.entity.Coupon;
import com.janesjeans.api.service.CouponService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/coupons")
@RequiredArgsConstructor
@Tag(name = "Coupons", description = "Coupon management for checkout discounts")
@SecurityRequirement(name = "bearerAuth")
public class CouponController {

    private final CouponService couponService;

    @Operation(summary = "List all coupons")
    @GetMapping
    public ResponseEntity<List<Coupon>> getAllCoupons() {
        return ResponseEntity.ok(couponService.getAllCoupons());
    }

    @Operation(summary = "Get coupon by ID")
    @GetMapping("/{id}")
    public ResponseEntity<Coupon> getCouponById(@PathVariable String id) {
        return ResponseEntity.ok(couponService.getCouponById(id));
    }

    @Operation(summary = "Get coupon by code")
    @GetMapping("/code/{code}")
    public ResponseEntity<Coupon> getCouponByCode(@PathVariable String code) {
        return ResponseEntity.ok(couponService.getCouponByCode(code));
    }

    @Operation(summary = "Create a coupon")
    @PostMapping
    public ResponseEntity<Coupon> createCoupon(@RequestBody Coupon coupon) {
        return ResponseEntity.status(201).body(couponService.createCoupon(coupon));
    }

    @Operation(summary = "Update a coupon")
    @PutMapping("/{id}")
    public ResponseEntity<Coupon> updateCoupon(@PathVariable String id, @RequestBody Coupon coupon) {
        return ResponseEntity.ok(couponService.updateCoupon(id, coupon));
    }

    @Operation(summary = "Delete a coupon")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCoupon(@PathVariable String id) {
        couponService.deleteCoupon(id);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Validate coupon and calculate discount")
    @PostMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateCoupon(@RequestBody Map<String, Object> body) {
        String code = (String) body.get("code");
        BigDecimal orderTotal = new BigDecimal(body.get("orderTotal").toString());
        BigDecimal discount = couponService.validateAndCalculateDiscount(code, orderTotal);
        Coupon coupon = couponService.getCouponByCode(code);
        return ResponseEntity.ok(Map.of(
            "valid", true,
            "discount", discount,
            "couponCode", code,
            "discountType", coupon.getDiscountType(),
            "discountValue", coupon.getDiscountValue()
        ));
    }
}
