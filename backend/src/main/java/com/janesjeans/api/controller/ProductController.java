package com.janesjeans.api.controller;

import com.janesjeans.api.entity.Product;
import com.janesjeans.api.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Tag(name = "Products", description = "Product inventory management (authenticated)")
@SecurityRequirement(name = "bearerAuth")
public class ProductController {

    private final ProductService productService;

    @Operation(summary = "List all products", description = "Returns all products, optionally filtered by gender")
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts(@RequestParam(required = false) String gender) {
        if (gender != null && !"All".equals(gender)) {
            return ResponseEntity.ok(productService.getProductsByGender(gender));
        }
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @Operation(summary = "Get product by ID")
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable String id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @Operation(summary = "Create a product")
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        return ResponseEntity.ok(productService.createProduct(product));
    }

    @Operation(summary = "Update a product")
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable String id, @RequestBody Product product) {
        return ResponseEntity.ok(productService.updateProduct(id, product));
    }

    @Operation(summary = "Delete a product")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable String id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok().build();
    }
}
