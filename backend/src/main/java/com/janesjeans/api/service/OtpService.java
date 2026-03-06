package com.janesjeans.api.service;

import com.janesjeans.api.dto.GuestOrderRequest;
import com.janesjeans.api.entity.Order;
import com.janesjeans.api.config.SMSConfige;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class OtpService {

    private final OrderService orderService;
    private final SMSConfige.SmsService smsService;
    private final EmailService emailService;
    private final PaymentService paymentService;
    private final ShipmentService shipmentService;
    private final ShippingVendorService shippingVendorService;

    // in-memory store: orderId -> entry
    private final Map<String, OtpEntry> store = new ConcurrentHashMap<>();

    public static class OtpEntry {
        public final String destination;
        public final String otp;
        public final long expiresAt;
        public final GuestOrderRequest pendingRequest;

        public OtpEntry(String destination, String otp, long expiresAt, GuestOrderRequest pendingRequest) {
            this.destination = destination;
            this.otp = otp;
            this.expiresAt = expiresAt;
            this.pendingRequest = pendingRequest;
        }
    }

    /**
     * Request an OTP for the given order. If pendingRequest is provided, its payment
     * and shipment data will be used to persist those records after successful verification.
     */
    public String requestOtp(String orderId, String destination, int ttlSeconds, String method, GuestOrderRequest pendingRequest) {
        if (destination == null || destination.isBlank()) {
            throw new IllegalArgumentException("destination required");
        }
        String normalized = destination.trim();

        Order order = orderService.getOrderById(orderId);
        Objects.requireNonNull(order, "order not found");

        String otp = smsService.generateOtp();
        long expiresAt = Instant.now().getEpochSecond() + Math.max(60, ttlSeconds);
        store.put(orderId, new OtpEntry(normalized, otp, expiresAt, pendingRequest));

        String orderNumber = "ORD-" + order.getId().substring(0, Math.min(8, order.getId().length())).toUpperCase();

        if ("email".equalsIgnoreCase(method)) {
            String html = emailService.buildOtpEmailMessage(order, orderNumber, otp);
            emailService.sendCustomOrderConfirmationAsync(order, orderNumber, html);
            log.info("OTP (email) requested for order {} -> {} (expires in {}s)", orderId, normalized, ttlSeconds);
        } else {
            smsService.sendOtpWithMessage(normalized, otp);
            log.info("OTP (sms) requested for order {} -> {} (expires in {}s)", orderId, normalized, ttlSeconds);
        }
        return otp;
    }

    /**
     * Verify the OTP for order. If successful, persist pending payment and shipment
     * information (if present) and mark order confirmed. If expired, mark order not verified.
     */
    public boolean verifyOtp(String orderId, String destination, String otp) {
        OtpEntry entry = store.get(orderId);
        if (entry == null) return false;
        if (!entry.destination.equals(destination)) return false;
        if (Instant.now().getEpochSecond() > entry.expiresAt) {
            store.remove(orderId);
            try { orderService.updateOrderStatus(orderId, "Not Verified"); } catch (Exception ignored) {}
            return false;
        }
        boolean ok = entry.otp.equals(otp);
        if (ok) {
            store.remove(orderId);
            try {
                if (entry.pendingRequest != null) {
                    GuestOrderRequest gr = entry.pendingRequest;
                    // create payment
                    com.janesjeans.api.entity.Payment payment = com.janesjeans.api.entity.Payment.builder()
                            .orderId(orderId)
                            .amount(gr.getTotalAmount())
                            .method(gr.getPayment() != null ? gr.getPayment().getType() : "unknown")
                            .status(gr.getPayment() != null ? gr.getPayment().getStatus() : "PENDING")
                            .notes("Guest OTP confirmation")
                            .build();
                    paymentService.createPayment(payment);

                    // choose a shipping vendor if available
                    String vendorId = null;
                    try {
                        var vendors = shippingVendorService.getAllVendors();
                        if (!vendors.isEmpty()) vendorId = vendors.get(0).getId();
                    } catch (Exception ignored) {}

                    String shippingAddress = gr.getShipmentDetails() != null ? String.format("%s, %s %s", gr.getShipmentDetails().getAddress(), gr.getShipmentDetails().getCity(), gr.getShipmentDetails().getPostalCode()) : "";
                    com.janesjeans.api.entity.Shipment shipment = com.janesjeans.api.entity.Shipment.builder()
                            .orderId(orderId)
                            .vendorId(vendorId != null ? vendorId : "")
                            .trackingNumber("")
                            .status("pending")
                            .shippingAddress(shippingAddress)
                            .notes(gr.getShipmentDetails() != null ? gr.getShipmentDetails().getPhone() : "")
                            .build();
                    shipmentService.createShipment(shipment);
                }
                orderService.updateOrderStatus(orderId, "Confirmed");
            } catch (Exception e) {
                log.warn("Failed to finalize order after OTP verify: {}", e.getMessage());
            }
        }
        return ok;
    }

    /**
     * Finalize pending request without OTP (skip verification).
     * Returns true if finalized, false if no pending entry found.
     */
    public boolean finalizePending(String orderId) {
        OtpEntry entry = store.remove(orderId);
        if (entry == null) return false;
        try {
            if (entry.pendingRequest != null) {
                GuestOrderRequest gr = entry.pendingRequest;
                com.janesjeans.api.entity.Payment payment = com.janesjeans.api.entity.Payment.builder()
                        .orderId(orderId)
                        .amount(gr.getTotalAmount())
                        .method(gr.getPayment() != null ? gr.getPayment().getType() : "unknown")
                        .status(gr.getPayment() != null ? gr.getPayment().getStatus() : "PENDING")
                        .notes("Guest skipped OTP confirmation")
                        .build();
                paymentService.createPayment(payment);

                String vendorId = null;
                try {
                    var vendors = shippingVendorService.getAllVendors();
                    if (!vendors.isEmpty()) vendorId = vendors.get(0).getId();
                } catch (Exception ignored) {}

                String shippingAddress = gr.getShipmentDetails() != null ? String.format("%s, %s %s", gr.getShipmentDetails().getAddress(), gr.getShipmentDetails().getCity(), gr.getShipmentDetails().getPostalCode()) : "";
                com.janesjeans.api.entity.Shipment shipment = com.janesjeans.api.entity.Shipment.builder()
                        .orderId(orderId)
                        .vendorId(vendorId != null ? vendorId : "")
                        .trackingNumber("")
                        .status("pending")
                        .shippingAddress(shippingAddress)
                        .notes(gr.getShipmentDetails() != null ? gr.getShipmentDetails().getPhone() : "")
                        .build();
                shipmentService.createShipment(shipment);
            }
            orderService.updateOrderStatus(orderId, "Confirmed");
            return true;
        } catch (Exception e) {
            log.warn("Failed to finalize pending order {}: {}", orderId, e.getMessage());
            return false;
        }
    }
}
