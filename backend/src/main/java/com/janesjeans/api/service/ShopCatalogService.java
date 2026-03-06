package com.janesjeans.api.service;

import com.janesjeans.api.entity.ShopCategory;
import com.janesjeans.api.entity.ShopProduct;
import com.janesjeans.api.entity.ShopSubcategory;
import com.janesjeans.api.repository.ShopCategoryRepository;
import com.janesjeans.api.repository.ShopProductRepository;
import com.janesjeans.api.repository.ShopSubcategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ShopCatalogService {

    private final ShopCategoryRepository categoryRepository;
    private final ShopSubcategoryRepository subcategoryRepository;
    private final ShopProductRepository productRepository;

    // ---- Categories ----

    public List<ShopCategory> getAllCategories() {
        return categoryRepository.findAll(Sort.by("sortOrder"));
    }

    public ShopCategory getCategoryBySlug(String slug) {
        return categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Category not found: " + slug));
    }

    // ---- Subcategories ----

    public List<ShopSubcategory> getSubcategoriesByCategoryId(String categoryId) {
        return subcategoryRepository.findByCategoryIdOrderBySortOrder(categoryId);
    }

    // ---- Products ----

    public List<ShopProduct> getAllShopProducts() {
        return productRepository.findAll();
    }

    public List<ShopProduct> getShopProductsByCategory(String category) {
        return productRepository.findByCategory(category);
    }

    public List<ShopProduct> getShopProductsByCategoryAndSub(String category, String subcategory) {
        return productRepository.findByCategoryAndSubcategory(category, subcategory);
    }

    public ShopProduct getShopProductById(String id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shop product not found: " + id));
    }
}
