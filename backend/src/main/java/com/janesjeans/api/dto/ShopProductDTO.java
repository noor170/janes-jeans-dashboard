package com.janesjeans.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
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
@Schema(description = "Product formatted for the public shop front-end")
public class ShopProductDTO {
    @Schema(example = "abc-123")
    private String id;
    @Schema(example = "Slim Fit Dark Wash Jeans")
    private String name;
    @Schema(example = "Premium quality slim fit jeans")
    private String description;
    @Schema(example = "79.99")
    private BigDecimal price;
    @Schema(example = "jeans")
    private String category;
    @Schema(example = "[\"28\",\"30\",\"32\",\"34\"]")
    private List<String> sizes;
    @Schema(example = "[\"Dark Wash\",\"Light Wash\"]")
    private List<String> colors;
    @Schema(example = "[\"/images/products/womens-slim-blue.jpg\"]")
    private List<String> images;
    @Schema(example = "true")
    private boolean inStock;
    @Schema(example = "4.5")
    private double rating;
    @Schema(example = "127")
    private int reviews;
    @Schema(example = "Women")
    private String gender;
    @Schema(example = "Slim")
    private String fit;
    @Schema(example = "Dark Wash")
    private String wash;
}
