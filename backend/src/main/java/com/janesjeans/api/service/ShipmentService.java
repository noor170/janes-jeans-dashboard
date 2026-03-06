package com.janesjeans.api.service;

import com.janesjeans.api.entity.Shipment;
import com.janesjeans.api.repository.ShipmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ShipmentService {

    private final ShipmentRepository shipmentRepository;

    public List<Shipment> getAllShipments() {
        return shipmentRepository.findAllByOrderByCreatedAtDesc();
    }

    public Shipment getShipmentById(String id) {
        return shipmentRepository.findById(id).orElseThrow(() -> new RuntimeException("Shipment not found"));
    }

    public Optional<Shipment> getShipmentByOrderId(String orderId) {
        return shipmentRepository.findByOrderId(orderId);
    }

    public Shipment createShipment(Shipment shipment) {
        return shipmentRepository.save(shipment);
    }

    public Shipment updateShipment(String id, Shipment updates) {
        Shipment shipment = getShipmentById(id);
        if (updates.getTrackingNumber() != null) shipment.setTrackingNumber(updates.getTrackingNumber());
        if (updates.getVendorId() != null) shipment.setVendorId(updates.getVendorId());
        if (updates.getShippingAddress() != null) shipment.setShippingAddress(updates.getShippingAddress());
        if (updates.getEstimatedDelivery() != null) shipment.setEstimatedDelivery(updates.getEstimatedDelivery());
        if (updates.getNotes() != null) shipment.setNotes(updates.getNotes());
        return shipmentRepository.save(shipment);
    }

    public Shipment updateShipmentStatus(String id, String status) {
        Shipment shipment = getShipmentById(id);
        shipment.setStatus(status);
        if ("picked_up".equals(status) || "in_transit".equals(status)) {
            if (shipment.getShippedAt() == null) shipment.setShippedAt(LocalDateTime.now());
        } else if ("delivered".equals(status)) {
            shipment.setDeliveredAt(LocalDateTime.now());
        }
        return shipmentRepository.save(shipment);
    }

    public void deleteShipment(String id) {
        shipmentRepository.deleteById(id);
    }
}
