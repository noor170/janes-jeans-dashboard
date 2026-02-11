package com.janesjeans.api.service;

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

    // in-memory store: orderId -> entry
    private final Map<String, OtpEntry> store = new ConcurrentHashMap<>();

    public static class OtpEntry {
        public final String phone;
        public final String otp;
        public final long expiresAt;

        public OtpEntry(String phone, String otp, long expiresAt) {
            this.phone = phone;
            this.otp = otp;
            this.expiresAt = expiresAt;
        }
    }

    public String requestOtp(String orderId, String destination, int ttlSeconds, String method) {
        if (destination == null || destination.isBlank()) {
            throw new IllegalArgumentException("destination required");
        }
        String normalized = destination.trim();

        Order order = orderService.getOrderById(orderId);
        Objects.requireNonNull(order, "order not found");

        String otp = smsService.generateOtp();
        long expiresAt = Instant.now().getEpochSecond() + Math.max(60, ttlSeconds);
        store.put(orderId, new OtpEntry(normalized, otp, expiresAt));

        String orderNumber = "ORD-" + order.getId().substring(0, Math.min(8, order.getId().length())).toUpperCase();

        if ("email".equalsIgnoreCase(method)) {
            String html = emailService.buildOtpEmailMessage(order, orderNumber, otp);
            // send via email service asynchronously
            emailService.sendCustomOrderConfirmationAsync(order, orderNumber, html);
            log.info("OTP (email) requested for order {} -> {} (expires in {}s)", orderId, normalized, ttlSeconds);
        } else {
            // SMS
            smsService.sendOtpWithMessage(normalized, otp);
            log.info("OTP (sms) requested for order {} -> {} (expires in {}s)", orderId, normalized, ttlSeconds);
        }
        return otp;
    }

    public boolean verifyOtp(String orderId, String phoneNumber, String otp) {
        OtpEntry entry = store.get(orderId);
        if (entry == null) return false;
        if (!entry.phone.equals(phoneNumber)) return false;
        if (Instant.now().getEpochSecond() > entry.expiresAt) {
            store.remove(orderId);
            return false;
        }
        boolean ok = entry.otp.equals(otp);
        if (ok) {
            store.remove(orderId);
            try {
                orderService.updateOrderStatus(orderId, "Confirmed");
            } catch (Exception e) {
                log.warn("Failed to set order status after OTP verify: {}", e.getMessage());
            }
        }
        return ok;
    }
}
