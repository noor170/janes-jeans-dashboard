package com.janesjeans.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Shop category with subcategories")
public class ShopCategoryDTO {
    private String id;
    private String name;
    private String slug;
    private String icon;
    private int sortOrder;
    private List<SubcategoryDTO> subcategories;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SubcategoryDTO {
        private String id;
        private String name;
        private String slug;
        private int sortOrder;
    }
}
