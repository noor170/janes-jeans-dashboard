package com.janesjeans.api.service;

import com.janesjeans.api.entity.ShippingVendor;
import com.janesjeans.api.repository.ShippingVendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ShippingVendorService {

    private final ShippingVendorRepository vendorRepository;

    public List<ShippingVendor> getAllVendors() {
        return vendorRepository.findAll();
    }

    public ShippingVendor getVendorById(String id) {
        return vendorRepository.findById(id).orElseThrow(() -> new RuntimeException("Vendor not found"));
    }

    public ShippingVendor createVendor(ShippingVendor vendor) {
        return vendorRepository.save(vendor);
    }

    public ShippingVendor updateVendor(String id, ShippingVendor updates) {
        ShippingVendor vendor = getVendorById(id);
        if (updates.getName() != null) vendor.setName(updates.getName());
        if (updates.getCode() != null) vendor.setCode(updates.getCode());
        if (updates.getContactEmail() != null) vendor.setContactEmail(updates.getContactEmail());
        if (updates.getContactPhone() != null) vendor.setContactPhone(updates.getContactPhone());
        if (updates.getWebsite() != null) vendor.setWebsite(updates.getWebsite());
        if (updates.getTrackingUrlTemplate() != null) vendor.setTrackingUrlTemplate(updates.getTrackingUrlTemplate());
        if (updates.getStatus() != null) vendor.setStatus(updates.getStatus());
        if (updates.getAvgDeliveryDays() != null) vendor.setAvgDeliveryDays(updates.getAvgDeliveryDays());
        return vendorRepository.save(vendor);
    }

    public void deleteVendor(String id) {
        vendorRepository.deleteById(id);
    }
}
