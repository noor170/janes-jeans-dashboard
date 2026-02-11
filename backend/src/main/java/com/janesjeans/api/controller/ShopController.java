package com.janesjeans.api.controller;

import com.janesjeans.api.dto.GuestOrderRequest;
import com.janesjeans.api.dto.GuestOrderResponse;
import com.janesjeans.api.dto.ShopProductDTO;
import com.janesjeans.api.entity.Order;
import com.janesjeans.api.entity.OrderItem;
import com.janesjeans.api.entity.Product;
import com.janesjeans.api.service.EmailService;
import com.janesjeans.api.service.OrderService;
import com.janesjeans.api.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/shop")
@RequiredArgsConstructor
@Slf4j
public class ShopController {

    private final ProductService productService;
    private final OrderService orderService;
    private final EmailService emailService;

    /**
     * Public: Get all products formatted for the shop frontend.
     * Groups products by name to aggregate sizes.
     */
    @GetMapping("/products")
    public ResponseEntity<List<ShopProductDTO>> getShopProducts(
            @RequestParam(required = false) String category) {

        List<Product> allProducts = productService.getAllProducts();

        Map<String, List<Product>> grouped = allProducts.stream()
                .collect(Collectors.groupingBy(Product::getName, LinkedHashMap::new, Collectors.toList()));

        List<ShopProductDTO> shopProducts = grouped.entrySet().stream()
                .map(entry -> buildShopProductDTO(entry.getValue()))
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

        List<Product> allProducts = productService.getAllProducts();
        List<Product> variants = allProducts.stream()
                .filter(p -> p.getName().equals(product.getName()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(buildShopProductDTO(variants));
    }

    /**
     * Public: Check stock availability for cart items before checkout.
     */
    @PostMapping("/check-stock")
    public ResponseEntity<Map<String, Object>> checkStock(@RequestBody List<GuestOrderRequest.GuestOrderItem> items) {
        List<Map<String, Object>> outOfStock = new ArrayList<>();

        for (GuestOrderRequest.GuestOrderItem item : items) {
            try {
                Product product = productService.getProductById(item.getProductId());
                if (product.getStockLevel() < item.getQuantity()) {
                    Map<String, Object> issue = new HashMap<>();
                    issue.put("productId", item.getProductId());
                    issue.put("productName", item.getProductName());
                    issue.put("requestedQuantity", item.getQuantity());
                    issue.put("availableStock", product.getStockLevel());
                    outOfStock.add(issue);
                }
            } catch (Exception e) {
                Map<String, Object> issue = new HashMap<>();
                issue.put("productId", item.getProductId());
                issue.put("productName", item.getProductName());
                issue.put("error", "Product not found");
                outOfStock.add(issue);
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("available", outOfStock.isEmpty());
        result.put("issues", outOfStock);
        return ResponseEntity.ok(result);
    }

    /**
     * Public: Create a guest order with stock validation.
     */
    @PostMapping("/orders")
    public ResponseEntity<?> createGuestOrder(@RequestBody GuestOrderRequest request) {
        // Validate stock before creating order
        List<String> stockErrors = new ArrayList<>();
        for (GuestOrderRequest.GuestOrderItem item : request.getItems()) {
            try {
                Product product = productService.getProductById(item.getProductId());
                if (product.getStockLevel() < item.getQuantity()) {
                    stockErrors.add(String.format("%s: only %d available (requested %d)",
                            item.getProductName(), product.getStockLevel(), item.getQuantity()));
                }
            } catch (Exception e) {
                stockErrors.add(item.getProductName() + ": product not found");
            }
        }

        if (!stockErrors.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", "Some items are out of stock");
            error.put("stockErrors", stockErrors);
            return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
        }

        // Deduct stock
        for (GuestOrderRequest.GuestOrderItem item : request.getItems()) {
            Product product = productService.getProductById(item.getProductId());
            product.setStockLevel(product.getStockLevel() - item.getQuantity());
            productService.updateProduct(product.getId(), product);
        }

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
        String orderNumber = "ORD-" + saved.getId().substring(0, 8).toUpperCase();
        log.info("Guest order created: {} ({})", saved.getId(), orderNumber);

        // Send confirmation email asynchronously
        emailService.sendOrderConfirmationAsync(saved, orderNumber);

        GuestOrderResponse response = GuestOrderResponse.builder()
                .id(saved.getId())
                .orderNumber(orderNumber)
                .status(saved.getStatus())
                .totalAmount(saved.getTotalAmount())
                .customerName(saved.getCustomerName())
                .customerEmail(saved.getCustomerEmail())
                .createdAt(saved.getCreatedAt())
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    private ShopProductDTO buildShopProductDTO(List<Product> variants) {
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
        int totalStock = variants.stream().mapToInt(Product::getStockLevel).sum();
        String imageUrl = first.getImageUrl() != null ? first.getImageUrl() : "/placeholder.svg";

        double rating = 4.0 + (Math.abs(first.getName().hashCode()) % 10) / 10.0;
        int reviews = 50 + Math.abs(first.getName().hashCode()) % 200;

        return ShopProductDTO.builder()
                .id(first.getId())
                .name(first.getName())
                .description(first.getDescription() != null ? first.getDescription() : "Premium quality " + first.getFit() + " jeans")
                .price(first.getPrice())
                .category(deriveCategoryFromFit(first.getFit()))
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
    }

    private String deriveCategoryFromFit(String fit) {
        if (fit == null) return "jeans";
        return "jeans";
    }
}
