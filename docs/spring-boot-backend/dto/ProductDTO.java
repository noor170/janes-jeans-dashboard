package com.janesjeans.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class ProductDTO {

    private String id;
    private String name;
    private String description;
    private BigDecimal price;
    private String category;
    private List<String> sizes;
    private List<String> colors;
    private String imageUrl;
    private Boolean inStock;
    private Double rating;
    private Integer reviews;
}
