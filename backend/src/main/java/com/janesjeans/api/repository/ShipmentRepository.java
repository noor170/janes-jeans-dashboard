package com.janesjeans.api.repository;

import com.janesjeans.api.entity.Shipment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShipmentRepository extends JpaRepository<Shipment, String> {
    List<Shipment> findAllByOrderByCreatedAtDesc();
    Optional<Shipment> findByOrderId(String orderId);
}
