package com.janesjeans.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShopProductDTO {
    private String id;
    private String name;
    private String description;
    private BigDecimal price;
    private String category;
    private List<String> sizes;
    private List<String> colors;
    private List<String> images;
    private boolean inStock;
    private double rating;
    private int reviews;
    private String gender;
    private String fit;
    private String wash;
}
