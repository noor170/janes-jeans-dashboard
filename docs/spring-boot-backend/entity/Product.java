package com.janesjeans.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "products")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProductCategory category;

    @Column(columnDefinition = "TEXT")
    private String sizes; // Comma-separated: "S,M,L,XL"

    @Column(columnDefinition = "TEXT")
    private String colors; // Comma-separated: "Black,White,Navy"

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "in_stock")
    private Boolean inStock = true;

    private Double rating;

    private Integer reviews;
}
