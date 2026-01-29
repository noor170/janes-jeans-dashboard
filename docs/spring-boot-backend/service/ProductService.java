package com.janesjeans.service;

import com.janesjeans.dto.ProductDTO;
import com.janesjeans.entity.Product;
import com.janesjeans.entity.ProductCategory;
import com.janesjeans.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<ProductDTO> getAllProducts(String category, BigDecimal minPrice, BigDecimal maxPrice) {
        ProductCategory categoryEnum = null;
        if (category != null && !category.equalsIgnoreCase("all")) {
            try {
                categoryEnum = ProductCategory.valueOf(category.toUpperCase());
            } catch (IllegalArgumentException e) {
                // Invalid category, ignore filter
            }
        }

        List<Product> products = productRepository.findWithFilters(categoryEnum, minPrice, maxPrice);
        return products.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public ProductDTO getProductById(String id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found: " + id));
        return mapToDTO(product);
    }

    private ProductDTO mapToDTO(Product product) {
        return ProductDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .category(product.getCategory().name().toLowerCase())
                .sizes(product.getSizes() != null 
                        ? Arrays.asList(product.getSizes().split(",")) 
                        : List.of())
                .colors(product.getColors() != null 
                        ? Arrays.asList(product.getColors().split(",")) 
                        : List.of())
                .imageUrl(product.getImageUrl())
                .inStock(product.getInStock())
                .rating(product.getRating())
                .reviews(product.getReviews())
                .build();
    }
}
