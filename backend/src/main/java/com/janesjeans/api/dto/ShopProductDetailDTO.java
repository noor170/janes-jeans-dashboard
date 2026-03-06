package com.janesjeans.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Shop product with flexible metadata for all categories")
public class ShopProductDetailDTO {
    private String id;
    private String name;
    private String description;
    private BigDecimal price;
    private String category;
    private String subcategory;
    private List<String> sizes;
    private List<String> colors;
    private List<String> images;
    private boolean inStock;
    private double rating;
    private int reviews;
    private Map<String, Object> metadata;
}
