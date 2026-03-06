package com.janesjeans.api.service;

import com.janesjeans.api.entity.Coupon;
import com.janesjeans.api.repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CouponService {

    private final CouponRepository couponRepository;

    public List<Coupon> getAllCoupons() {
        return couponRepository.findAll();
    }

    public Coupon getCouponById(String id) {
        return couponRepository.findById(id).orElseThrow(() -> new RuntimeException("Coupon not found"));
    }

    public Coupon getCouponByCode(String code) {
        return couponRepository.findByCode(code).orElseThrow(() -> new RuntimeException("Coupon not found"));
    }

    public Coupon createCoupon(Coupon coupon) {
        if (couponRepository.existsByCode(coupon.getCode())) {
            throw new RuntimeException("Coupon code already exists");
        }
        return couponRepository.save(coupon);
    }

    public Coupon updateCoupon(String id, Coupon updates) {
        Coupon coupon = getCouponById(id);
        if (updates.getCode() != null) coupon.setCode(updates.getCode());
        if (updates.getDescription() != null) coupon.setDescription(updates.getDescription());
        if (updates.getDiscountType() != null) coupon.setDiscountType(updates.getDiscountType());
        if (updates.getDiscountValue() != null) coupon.setDiscountValue(updates.getDiscountValue());
        if (updates.getMinOrderAmount() != null) coupon.setMinOrderAmount(updates.getMinOrderAmount());
        if (updates.getMaxDiscountAmount() != null) coupon.setMaxDiscountAmount(updates.getMaxDiscountAmount());
        if (updates.getUsageLimit() != null) coupon.setUsageLimit(updates.getUsageLimit());
        if (updates.getIsActive() != null) coupon.setIsActive(updates.getIsActive());
        if (updates.getValidFrom() != null) coupon.setValidFrom(updates.getValidFrom());
        if (updates.getValidUntil() != null) coupon.setValidUntil(updates.getValidUntil());
        return couponRepository.save(coupon);
    }

    public void deleteCoupon(String id) {
        couponRepository.deleteById(id);
    }

    public BigDecimal validateAndCalculateDiscount(String code, BigDecimal orderTotal) {
        Coupon coupon = getCouponByCode(code);
        LocalDateTime now = LocalDateTime.now();

        if (!coupon.getIsActive()) throw new RuntimeException("Coupon is inactive");
        if (now.isBefore(coupon.getValidFrom())) throw new RuntimeException("Coupon is not yet valid");
        if (now.isAfter(coupon.getValidUntil())) throw new RuntimeException("Coupon has expired");
        if (coupon.getUsageLimit() != null && coupon.getUsedCount() >= coupon.getUsageLimit())
            throw new RuntimeException("Coupon usage limit reached");
        if (orderTotal.compareTo(coupon.getMinOrderAmount()) < 0)
            throw new RuntimeException("Order does not meet minimum amount of $" + coupon.getMinOrderAmount());

        BigDecimal discount;
        if ("PERCENTAGE".equals(coupon.getDiscountType())) {
            discount = orderTotal.multiply(coupon.getDiscountValue()).divide(BigDecimal.valueOf(100));
            if (coupon.getMaxDiscountAmount() != null && discount.compareTo(coupon.getMaxDiscountAmount()) > 0) {
                discount = coupon.getMaxDiscountAmount();
            }
        } else {
            discount = coupon.getDiscountValue();
        }

        return discount;
    }
}
