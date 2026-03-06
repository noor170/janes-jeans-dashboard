package com.janesjeans.api.repository;

import com.janesjeans.api.entity.ShopProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShopProductRepository extends JpaRepository<ShopProduct, String> {
    List<ShopProduct> findByCategory(String category);
    List<ShopProduct> findByCategoryAndSubcategory(String category, String subcategory);
    List<ShopProduct> findByInStockTrue();
}
