package com.janesjeans.api.controller;

import com.janesjeans.api.dto.GuestOrderRequest;
import com.janesjeans.api.dto.GuestOrderResponse;
import com.janesjeans.api.dto.ShopProductDTO;
import com.janesjeans.api.entity.Order;
import com.janesjeans.api.entity.OrderItem;
import com.janesjeans.api.entity.Product;
import com.janesjeans.api.service.OrderService;
import com.janesjeans.api.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/shop")
@RequiredArgsConstructor
public class ShopController {

    private final ProductService productService;
    private final OrderService orderService;

    /**
     * Public: Get all products formatted for the shop frontend.
     * Groups products by name to aggregate sizes.
     */
    @GetMapping("/products")
    public ResponseEntity<List<ShopProductDTO>> getShopProducts(
            @RequestParam(required = false) String category) {

        List<Product> allProducts = productService.getAllProducts();

        // Group by product name to aggregate sizes
        Map<String, List<Product>> grouped = allProducts.stream()
                .collect(Collectors.groupingBy(Product::getName, LinkedHashMap::new, Collectors.toList()));

        List<ShopProductDTO> shopProducts = grouped.entrySet().stream()
                .map(entry -> {
                    List<Product> variants = entry.getValue();
                    Product first = variants.get(0);

                    List<String> sizes = variants.stream()
                            .map(Product::getSize)
                            .distinct()
                            .sorted()
                            .collect(Collectors.toList());

                    List<String> colors = variants.stream()
                            .map(Product::getWash)
                            .filter(Objects::nonNull)
                            .distinct()
                            .collect(Collectors.toList());
                    if (colors.isEmpty()) colors = List.of("Default");

                    boolean inStock = variants.stream().anyMatch(p -> p.getStockLevel() > 0);

                    String cat = deriveCategoryFromFit(first.getFit());

                    String imageUrl = first.getImageUrl() != null ? first.getImageUrl() : "/placeholder.svg";

                    // Generate consistent rating from product name hash
                    double rating = 4.0 + (Math.abs(first.getName().hashCode()) % 10) / 10.0;
                    int reviews = 50 + Math.abs(first.getName().hashCode()) % 200;

                    return ShopProductDTO.builder()
                            .id(first.getId())
                            .name(first.getName())
                            .description(first.getDescription() != null ? first.getDescription() : "Premium quality " + first.getFit() + " jeans")
                            .price(first.getPrice())
                            .category(cat)
                            .sizes(sizes)
                            .colors(colors)
                            .images(List.of(imageUrl))
                            .inStock(inStock)
                            .rating(Math.min(rating, 5.0))
                            .reviews(reviews)
                            .gender(first.getGender())
                            .fit(first.getFit())
                            .wash(first.getWash())
                            .build();
                })
                .filter(p -> category == null || "all".equals(category) || p.getCategory().equals(category))
                .collect(Collectors.toList());

        return ResponseEntity.ok(shopProducts);
    }

    /**
     * Public: Get a single product by ID for the shop.
     */
    @GetMapping("/products/{id}")
    public ResponseEntity<ShopProductDTO> getShopProduct(@PathVariable String id) {
        Product product = productService.getProductById(id);

        // Find all variants with same name
        List<Product> allProducts = productService.getAllProducts();
        List<Product> variants = allProducts.stream()
                .filter(p -> p.getName().equals(product.getName()))
                .collect(Collectors.toList());

        List<String> sizes = variants.stream()
                .map(Product::getSize)
                .distinct()
                .sorted()
                .collect(Collectors.toList());

        List<String> colors = variants.stream()
                .map(Product::getWash)
                .filter(Objects::nonNull)
                .distinct()
                .collect(Collectors.toList());
        if (colors.isEmpty()) colors = List.of("Default");

        boolean inStock = variants.stream().anyMatch(p -> p.getStockLevel() > 0);
        String imageUrl = product.getImageUrl() != null ? product.getImageUrl() : "/placeholder.svg";
        double rating = 4.0 + (Math.abs(product.getName().hashCode()) % 10) / 10.0;
        int reviews = 50 + Math.abs(product.getName().hashCode()) % 200;

        ShopProductDTO dto = ShopProductDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription() != null ? product.getDescription() : "Premium quality " + product.getFit() + " jeans")
                .price(product.getPrice())
                .category(deriveCategoryFromFit(product.getFit()))
                .sizes(sizes)
                .colors(colors)
                .images(List.of(imageUrl))
                .inStock(inStock)
                .rating(Math.min(rating, 5.0))
                .reviews(reviews)
                .gender(product.getGender())
                .fit(product.getFit())
                .wash(product.getWash())
                .build();

        return ResponseEntity.ok(dto);
    }

    /**
     * Public: Create a guest order (no authentication required).
     */
    @PostMapping("/orders")
    public ResponseEntity<GuestOrderResponse> createGuestOrder(@RequestBody GuestOrderRequest request) {
        String shippingAddress = String.format("%s, %s %s",
                request.getShipmentDetails().getAddress(),
                request.getShipmentDetails().getCity(),
                request.getShipmentDetails().getPostalCode());

        Order order = Order.builder()
                .customerName(request.getShipmentDetails().getName())
                .customerEmail(request.getShipmentDetails().getEmail())
                .status("Pending")
                .totalAmount(request.getTotalAmount())
                .shippingAddress(shippingAddress)
                .notes("Payment: " + request.getPayment().getType() + " | Phone: " + request.getShipmentDetails().getPhone())
                .items(new ArrayList<>())
                .build();

        for (GuestOrderRequest.GuestOrderItem item : request.getItems()) {
            OrderItem orderItem = OrderItem.builder()
                    .productId(item.getProductId())
                    .productName(item.getProductName())
                    .size(item.getSize())
                    .quantity(item.getQuantity())
                    .price(item.getPrice())
                    .build();
            order.getItems().add(orderItem);
        }

        Order saved = orderService.createOrder(order);

        GuestOrderResponse response = GuestOrderResponse.builder()
                .id(saved.getId())
                .orderNumber("ORD-" + saved.getId().substring(0, 8).toUpperCase())
                .status(saved.getStatus())
                .totalAmount(saved.getTotalAmount())
                .customerName(saved.getCustomerName())
                .customerEmail(saved.getCustomerEmail())
                .createdAt(saved.getCreatedAt())
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    private String deriveCategoryFromFit(String fit) {
        if (fit == null) return "jeans";
        String lower = fit.toLowerCase();
        if (lower.contains("slim") || lower.contains("skinny")) return "jeans";
        if (lower.contains("relaxed") || lower.contains("straight")) return "jeans";
        if (lower.contains("boot") || lower.contains("wide")) return "jeans";
        return "jeans";
    }
}
