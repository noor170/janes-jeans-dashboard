package com.janesjeans.api.repository;

import com.janesjeans.api.entity.ShopProduct;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ShopProductRepository extends JpaRepository<ShopProduct, String> {

    List<ShopProduct> findByCategory(String category);
    List<ShopProduct> findByCategoryAndSubcategory(String category, String subcategory);
    List<ShopProduct> findByInStockTrue();

    // Paginated + search + filter
    @Query("SELECT p FROM ShopProduct p WHERE " +
           "(:category IS NULL OR p.category = :category) AND " +
           "(:subcategory IS NULL OR p.subcategory = :subcategory) AND " +
           "(:inStock IS NULL OR p.inStock = :inStock) AND " +
           "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
           "(:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<ShopProduct> searchCatalog(
            @Param("category") String category,
            @Param("subcategory") String subcategory,
            @Param("inStock") Boolean inStock,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("search") String search,
            Pageable pageable);
}
