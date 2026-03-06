package com.janesjeans.api.service;

import com.janesjeans.api.entity.Product;
import com.janesjeans.api.entity.ProductReturn;
import com.janesjeans.api.repository.ProductRepository;
import com.janesjeans.api.repository.ProductReturnRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductReturnService {

    private final ProductReturnRepository returnRepository;
    private final ProductRepository productRepository;

    public List<ProductReturn> getAll() {
        return returnRepository.findAll();
    }

    public ProductReturn getById(String id) {
        return returnRepository.findById(id).orElseThrow(() -> new RuntimeException("Return not found"));
    }

    public List<ProductReturn> getByOrderId(String orderId) {
        return returnRepository.findByOrderId(orderId);
    }

    public List<ProductReturn> getByStatus(String status) {
        return returnRepository.findByStatus(status);
    }

    public ProductReturn create(ProductReturn productReturn) {
        return returnRepository.save(productReturn);
    }

    public ProductReturn update(String id, ProductReturn updates) {
        ProductReturn ret = getById(id);
        if (updates.getStatus() != null) ret.setStatus(updates.getStatus());
        if (updates.getRefundAmount() != null) ret.setRefundAmount(updates.getRefundAmount());
        if (updates.getRefundStatus() != null) ret.setRefundStatus(updates.getRefundStatus());
        if (updates.getRestock() != null) ret.setRestock(updates.getRestock());
        if (updates.getNotes() != null) ret.setNotes(updates.getNotes());
        if (updates.getReason() != null) ret.setReason(updates.getReason());
        if (updates.getDescription() != null) ret.setDescription(updates.getDescription());
        if (updates.getQuantity() != null) ret.setQuantity(updates.getQuantity());
        return returnRepository.save(ret);
    }

    @Transactional
    public ProductReturn approve(String id) {
        ProductReturn ret = getById(id);
        ret.setStatus("APPROVED");
        ret.setResolvedAt(LocalDateTime.now());

        // Restock if flagged
        if (Boolean.TRUE.equals(ret.getRestock())) {
            productRepository.findById(ret.getProductId()).ifPresent(product -> {
                product.setStockLevel(product.getStockLevel() + ret.getQuantity());
                productRepository.save(product);
            });
        }

        return returnRepository.save(ret);
    }

    public ProductReturn reject(String id, String notes) {
        ProductReturn ret = getById(id);
        ret.setStatus("REJECTED");
        ret.setResolvedAt(LocalDateTime.now());
        if (notes != null) ret.setNotes(notes);
        return returnRepository.save(ret);
    }

    public void delete(String id) {
        returnRepository.deleteById(id);
    }
}
