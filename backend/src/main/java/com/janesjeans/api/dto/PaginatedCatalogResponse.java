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
@Schema(description = "Paginated response wrapper for catalog products")
public class PaginatedCatalogResponse {
    @Schema(description = "List of products on this page")
    private List<ShopProductDetailDTO> content;

    @Schema(description = "Current page number (0-based)", example = "0")
    private int page;

    @Schema(description = "Number of items per page", example = "12")
    private int size;

    @Schema(description = "Total number of matching products", example = "36")
    private long totalElements;

    @Schema(description = "Total number of pages", example = "3")
    private int totalPages;

    @Schema(description = "Whether this is the last page")
    private boolean last;

    @Schema(description = "Whether this is the first page")
    private boolean first;
}
