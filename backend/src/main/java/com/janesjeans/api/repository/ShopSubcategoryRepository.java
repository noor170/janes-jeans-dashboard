package com.janesjeans.api.repository;

import com.janesjeans.api.entity.ShopSubcategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShopSubcategoryRepository extends JpaRepository<ShopSubcategory, String> {
    List<ShopSubcategory> findByCategoryIdOrderBySortOrder(String categoryId);
}
