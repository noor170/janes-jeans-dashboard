package com.janesjeans.api.service;

import com.janesjeans.api.entity.Product;
import com.janesjeans.api.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public List<Product> getProductsByGender(String gender) {
        return productRepository.findByGender(gender);
    }

    public Product getProductById(String id) {
        return productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
    }

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    public Product updateProduct(String id, Product updates) {
        Product product = getProductById(id);
        if (updates.getName() != null) product.setName(updates.getName());
        if (updates.getDescription() != null) product.setDescription(updates.getDescription());
        if (updates.getGender() != null) product.setGender(updates.getGender());
        if (updates.getFit() != null) product.setFit(updates.getFit());
        if (updates.getSize() != null) product.setSize(updates.getSize());
        if (updates.getWash() != null) product.setWash(updates.getWash());
        if (updates.getPrice() != null) product.setPrice(updates.getPrice());
        if (updates.getStockLevel() != null) product.setStockLevel(updates.getStockLevel());
        if (updates.getImageUrl() != null) product.setImageUrl(updates.getImageUrl());
        return productRepository.save(product);
    }

    public void deleteProduct(String id) {
        productRepository.deleteById(id);
    }

    public List<Product> getLowStockProducts(int threshold) {
        return productRepository.findByStockLevelLessThan(threshold);
    }
}
