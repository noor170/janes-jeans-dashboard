package com.janesjeans.api.repository;

import com.janesjeans.api.entity.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, String> {
    Optional<Coupon> findByCode(String code);
    boolean existsByCode(String code);
    List<Coupon> findByIsActive(boolean isActive);
}
