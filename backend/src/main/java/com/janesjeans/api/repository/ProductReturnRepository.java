package com.janesjeans.api.repository;

import com.janesjeans.api.entity.ProductReturn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductReturnRepository extends JpaRepository<ProductReturn, String> {
    List<ProductReturn> findByOrderId(String orderId);
    List<ProductReturn> findByProductId(String productId);
    List<ProductReturn> findByStatus(String status);
    List<ProductReturn> findByCustomerEmail(String email);
}
