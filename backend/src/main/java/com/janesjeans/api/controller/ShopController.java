package com.janesjeans.api.controller;

import com.janesjeans.api.dto.GuestOrderRequest;
import com.janesjeans.api.dto.GuestOrderResponse;
import com.janesjeans.api.dto.ShopProductDTO;
import com.janesjeans.api.entity.Order;
import com.janesjeans.api.entity.OrderItem;
import com.janesjeans.api.entity.Product;
import com.janesjeans.api.service.EmailService;
import com.janesjeans.api.service.OrderService;
import com.janesjeans.api.service.OtpService;
import com.janesjeans.api.service.ProductService;
import com.janesjeans.api.service.PaymentService;
import com.janesjeans.api.service.ShipmentService;
import com.janesjeans.api.service.ShippingVendorService;
import com.janesjeans.api.entity.Shipment;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Shop (Public)", description = "Public storefront endpoints – no authentication required")
public class ShopController {

    private final ProductService productService;
    private final OrderService orderService;
    private final EmailService emailService;
    private final PaymentService paymentService;
    private final ShipmentService shipmentService;
    private final ShippingVendorService shippingVendorService;
    private final OtpService otpService;

    @Operation(summary = "List shop products", description = "Returns all products grouped by name with aggregated sizes. Optionally filter by category.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Products retrieved", content = @Content(array = @ArraySchema(schema = @Schema(implementation = ShopProductDTO.class))))
    })
    @GetMapping("/products")
    public ResponseEntity<List<ShopProductDTO>> getShopProducts(@RequestParam(required = false) String category) {
        List<Product> allProducts = productService.getAllProducts();
        Map<String, List<Product>> grouped = allProducts.stream()
                .collect(Collectors.groupingBy(Product::getName, LinkedHashMap::new, Collectors.toList()));
        List<ShopProductDTO> shopProducts = grouped.entrySet().stream()
                .map(entry -> buildShopProductDTO(entry.getValue()))
                .filter(p -> category == null || "all".equals(category) || p.getCategory().equals(category))
                .collect(Collectors.toList());
        return ResponseEntity.ok(shopProducts);
    }

    @Operation(summary = "Get shop product by ID", description = "Returns a single product with all size/color variants")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Product found", content = @Content(schema = @Schema(implementation = ShopProductDTO.class))),
        @ApiResponse(responseCode = "404", description = "Product not found", content = @Content)
    })
    @GetMapping("/products/{id}")
    public ResponseEntity<ShopProductDTO> getShopProduct(@PathVariable String id) {
        Product product = productService.getProductById(id);
        List<Product> allProducts = productService.getAllProducts();
        List<Product> variants = allProducts.stream()
                .filter(p -> p.getName().equals(product.getName()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(buildShopProductDTO(variants));
    }

    @Operation(summary = "Check stock availability", description = "Validates stock levels for a list of cart items before checkout")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Stock check result with available flag and any issues")
    })
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

    @Operation(summary = "Create guest order", description = "Places a new order as a guest with stock validation and email confirmation")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Order created", content = @Content(schema = @Schema(implementation = GuestOrderResponse.class))),
        @ApiResponse(responseCode = "409", description = "Some items are out of stock", content = @Content)
    })
    @PostMapping("/orders")
    public ResponseEntity<?> createGuestOrder(@RequestBody GuestOrderRequest request) {
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

    @Operation(summary = "Confirm guest order (save order + payment + shipment)", description = "Places a new order as a guest and persists order, payment and shipment records")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Order confirmed", content = @Content(schema = @Schema(implementation = GuestOrderResponse.class))),
        @ApiResponse(responseCode = "409", description = "Some items are out of stock", content = @Content)
    })
    @PostMapping("/orders/confirm")
    public ResponseEntity<?> confirmGuestOrder(@RequestBody GuestOrderRequest request) {
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
                .status("Confirmed")
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

        // persist payment
        com.janesjeans.api.entity.Payment payment = com.janesjeans.api.entity.Payment.builder()
                .orderId(saved.getId())
                .amount(request.getTotalAmount())
                .method(request.getPayment() != null ? request.getPayment().getType() : "unknown")
                .status(request.getPayment() != null ? request.getPayment().getStatus() : "PENDING")
                .notes("Guest checkout")
                .build();
        paymentService.createPayment(payment);

        // choose a shipping vendor if available
        String vendorId = null;
        try {
            var vendors = shippingVendorService.getAllVendors();
            if (!vendors.isEmpty()) vendorId = vendors.get(0).getId();
        } catch (Exception ignored) {}

        Shipment shipment = Shipment.builder()
                .orderId(saved.getId())
                .vendorId(vendorId != null ? vendorId : "")
                .trackingNumber("")
                .status("pending")
                .shippingAddress(shippingAddress)
                .notes(request.getShipmentDetails().getPhone())
                .build();
        shipmentService.createShipment(shipment);

        String orderNumber = "ORD-" + saved.getId().substring(0, 8).toUpperCase();
        log.info("Guest order confirmed: {} ({})", saved.getId(), orderNumber);
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

    @Operation(summary = "Initiate guest order with OTP confirmation", description = "Places a new order as pending verification and sends an OTP by SMS or email. Payment and shipment are created after OTP verification.")
    @ApiResponses({
        @ApiResponse(responseCode = "202", description = "Order created and OTP sent"),
        @ApiResponse(responseCode = "409", description = "Some items are out of stock", content = @Content)
    })
    @PostMapping("/orders/confirm-with-otp")
    public ResponseEntity<?> confirmGuestOrderWithOtp(@RequestBody GuestOrderRequest request,
                                                     @RequestParam(required = false) String method,
                                                     @RequestParam(required = false) String contact) {
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
                .status("PendingVerification")
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

        String usedMethod = method == null ? "sms" : method;
        String dest = contact;
        if (dest == null) {
            dest = "email".equalsIgnoreCase(usedMethod) ? request.getShipmentDetails().getEmail() : request.getShipmentDetails().getPhone();
        }
        otpService.requestOtp(saved.getId(), dest, 300, usedMethod, request);

        Map<String, Object> response = new HashMap<>();
        response.put("id", saved.getId());
        response.put("status", saved.getStatus());
        response.put("orderNumber", "ORD-" + saved.getId().substring(0, 8).toUpperCase());
        response.put("message", "Order created and OTP sent");
        return ResponseEntity.accepted().body(response);
    }

    private ShopProductDTO buildShopProductDTO(List<Product> variants) {
        Product first = variants.get(0);
        List<String> sizes = variants.stream().map(Product::getSize).distinct().sorted().collect(Collectors.toList());
        List<String> colors = variants.stream().map(Product::getWash).filter(Objects::nonNull).distinct().collect(Collectors.toList());
        if (colors.isEmpty()) colors = List.of("Default");
        boolean inStock = variants.stream().anyMatch(p -> p.getStockLevel() > 0);
        String imageUrl = first.getImageUrl() != null ? first.getImageUrl() : "/placeholder.svg";
        double rating = 4.0 + (Math.abs(first.getName().hashCode()) % 10) / 10.0;
        int reviews = 50 + Math.abs(first.getName().hashCode()) % 200;
        return ShopProductDTO.builder()
                .id(first.getId()).name(first.getName())
                .description(first.getDescription() != null ? first.getDescription() : "Premium quality " + first.getFit() + " jeans")
                .price(first.getPrice()).category(deriveCategoryFromFit(first.getFit()))
                .sizes(sizes).colors(colors).images(List.of(imageUrl))
                .inStock(inStock).rating(Math.min(rating, 5.0)).reviews(reviews)
                .gender(first.getGender()).fit(first.getFit()).wash(first.getWash())
                .build();
    }

    private String deriveCategoryFromFit(String fit) {
        if (fit == null) return "jeans";
        return "jeans";
    }
}
