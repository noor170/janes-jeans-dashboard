package com.janesjeans.api.repository;

import com.janesjeans.api.entity.ShopCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ShopCategoryRepository extends JpaRepository<ShopCategory, String> {
    Optional<ShopCategory> findBySlug(String slug);
}
