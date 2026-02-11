package com.janesjeans.api.repository;

import com.janesjeans.api.entity.ShippingVendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShippingVendorRepository extends JpaRepository<ShippingVendor, String> {
}
