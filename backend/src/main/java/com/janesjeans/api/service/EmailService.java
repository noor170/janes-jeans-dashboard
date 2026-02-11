package com.janesjeans.api.service;

import com.janesjeans.api.entity.Order;
import com.janesjeans.api.entity.OrderItem;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@janesjeans.com}")
    private String fromEmail;

    @Async
    public void sendOrderConfirmationAsync(Order order, String orderNumber) {
        try {
            sendOrderConfirmation(order, orderNumber);
        } catch (Exception e) {
            log.error("Failed to send order confirmation email for order {}: {}", orderNumber, e.getMessage());
        }
    }

    @Async
    public void sendCustomOrderConfirmationAsync(Order order, String orderNumber, String htmlBody) {
        try {
            sendCustomOrderConfirmation(order, orderNumber, htmlBody);
        } catch (Exception e) {
            log.error("Failed to send custom order confirmation email for order {}: {}", orderNumber, e.getMessage());
        }
    }

    public void sendOrderConfirmation(Order order, String orderNumber) throws MessagingException {
        String toEmail = order.getCustomerEmail();
        if (toEmail == null || toEmail.isBlank()) {
            log.warn("No email address for order {}, skipping confirmation", orderNumber);
            return;
        }

        log.info("Sending order confirmation email to {} for order {}", toEmail, orderNumber);

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(toEmail);
        helper.setSubject("Order Confirmation - " + orderNumber + " | Jane's Jeans");

        String htmlContent = buildOrderConfirmationHtml(order, orderNumber);
        helper.setText(htmlContent, true);

        mailSender.send(message);
        log.info("Order confirmation email sent successfully to {}", toEmail);
    }

    /**
     * Send an email using a provided HTML body (for custom confirmation messages).
     */
    public void sendCustomOrderConfirmation(Order order, String orderNumber, String htmlBody) throws MessagingException {
        String toEmail = order.getCustomerEmail();
        if (toEmail == null || toEmail.isBlank()) {
            log.warn("No email address for order {}, skipping confirmation", orderNumber);
            return;
        }
        log.info("Sending custom order confirmation email to {} for order {}", toEmail, orderNumber);
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setFrom(fromEmail);
        helper.setTo(toEmail);
        helper.setSubject("Order Confirmation - " + orderNumber + " | Jane's Jeans");
        helper.setText(htmlBody, true);
        mailSender.send(message);
        log.info("Custom order confirmation email sent successfully to {}", toEmail);
    }

    private String buildOrderConfirmationHtml(Order order, String orderNumber) {
        StringBuilder items = new StringBuilder();
        if (order.getItems() != null) {
            for (OrderItem item : order.getItems()) {
                BigDecimal subtotal = item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
                items.append(String.format(
                    "<tr>" +
                    "<td style='padding:12px 8px;border-bottom:1px solid #e5e7eb;'>%s<br><span style='color:#6b7280;font-size:13px;'>Size: %s</span></td>" +
                    "<td style='padding:12px 8px;border-bottom:1px solid #e5e7eb;text-align:center;'>%d</td>" +
                    "<td style='padding:12px 8px;border-bottom:1px solid #e5e7eb;text-align:right;'>$%.2f</td>" +
                    "</tr>",
                    item.getProductName(),
                    item.getSize() != null ? item.getSize() : "N/A",
                    item.getQuantity(),
                    subtotal
                ));
            }
        }

        return "<!DOCTYPE html><html><head><meta charset='UTF-8'></head><body style='margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;'>" +
            "<div style='max-width:600px;margin:0 auto;background:#ffffff;'>" +
            // Header
            "<div style='background:#1a1a2e;padding:32px 24px;text-align:center;'>" +
            "<h1 style='color:#ffffff;margin:0;font-size:28px;letter-spacing:1px;'>JANE'S JEANS</h1>" +
            "</div>" +
            // Confirmation banner
            "<div style='background:#ecfdf5;padding:24px;text-align:center;border-bottom:2px solid #10b981;'>" +
            "<p style='margin:0;font-size:24px;'>✓</p>" +
            "<h2 style='margin:8px 0 4px;color:#065f46;font-size:20px;'>Order Confirmed!</h2>" +
            "<p style='margin:0;color:#047857;font-size:14px;'>Order " + orderNumber + "</p>" +
            "</div>" +
            // Greeting
            "<div style='padding:24px;'>" +
            "<p style='margin:0 0 16px;color:#374151;'>Hi " + (order.getCustomerName() != null ? order.getCustomerName() : "there") + ",</p>" +
            "<p style='margin:0 0 24px;color:#374151;'>Thank you for your order! Here's a summary of what you purchased:</p>" +
            // Items table
            "<table style='width:100%;border-collapse:collapse;'>" +
            "<thead><tr style='background:#f9fafb;'>" +
            "<th style='padding:12px 8px;text-align:left;font-size:13px;color:#6b7280;text-transform:uppercase;'>Item</th>" +
            "<th style='padding:12px 8px;text-align:center;font-size:13px;color:#6b7280;text-transform:uppercase;'>Qty</th>" +
            "<th style='padding:12px 8px;text-align:right;font-size:13px;color:#6b7280;text-transform:uppercase;'>Price</th>" +
            "</tr></thead><tbody>" +
            items.toString() +
            "</tbody></table>" +
            // Total
            "<div style='margin-top:16px;padding:16px;background:#f9fafb;border-radius:8px;text-align:right;'>" +
            "<span style='font-size:18px;font-weight:700;color:#111827;'>Total: $" + String.format("%.2f", order.getTotalAmount()) + "</span>" +
            "</div>" +
            // Shipping address
            (order.getShippingAddress() != null ?
                "<div style='margin-top:24px;padding:16px;border:1px solid #e5e7eb;border-radius:8px;'>" +
                "<h3 style='margin:0 0 8px;font-size:14px;color:#6b7280;text-transform:uppercase;'>Shipping Address</h3>" +
                "<p style='margin:0;color:#374151;'>" + order.getShippingAddress().replace(",", "<br>") + "</p>" +
                "</div>" : "") +
            "</div>" +
            // Footer
            "<div style='background:#f9fafb;padding:24px;text-align:center;border-top:1px solid #e5e7eb;'>" +
            "<p style='margin:0 0 8px;color:#6b7280;font-size:13px;'>Questions? Reply to this email or contact us.</p>" +
            "<p style='margin:0;color:#9ca3af;font-size:12px;'>© Jane's Jeans. All rights reserved.</p>" +
            "</div>" +
            "</div></body></html>";
    }

    /**
     * Build a concise, elegant confirmation email body containing only the essentials:
     * order number, amount to pay, order item details, and shipping details.
     */
    public String buildConfirmOrderByEmailMessage(Order order, String orderNumber) {
        StringBuilder items = new StringBuilder();
        if (order.getItems() != null) {
            for (OrderItem item : order.getItems()) {
                java.math.BigDecimal subtotal = item.getPrice().multiply(java.math.BigDecimal.valueOf(item.getQuantity()));
                items.append(String.format(
                    "<tr>" +
                    "<td style='padding:12px 8px;border-bottom:1px solid #e5e7eb;'>%s<br><span style='color:#6b7280;font-size:13px;'>Size: %s</span></td>" +
                    "<td style='padding:12px 8px;border-bottom:1px solid #e5e7eb;text-align:center;'>%d</td>" +
                    "<td style='padding:12px 8px;border-bottom:1px solid #e5e7eb;text-align:right;'>$%.2f</td>" +
                    "</tr>",
                    item.getProductName(),
                    item.getSize() != null ? item.getSize() : "N/A",
                    item.getQuantity(),
                    subtotal
                ));
            }
        }

        String shipping = order.getShippingAddress() != null ? order.getShippingAddress().replace(",", "<br>") : "--";

        String html = "<!DOCTYPE html><html><head><meta charset='UTF-8'></head><body style='margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;'>" +
            "<div style='max-width:680px;margin:24px auto;background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 8px 30px rgba(2,6,23,0.08);'>" +
            "<div style='background:linear-gradient(90deg,#0ea5a4,#0ea5a4);padding:28px;text-align:center;color:#ffffff;'>" +
            "<h1 style='margin:0;font-size:22px;letter-spacing:1px;'>Thank you — your order is on the way!</h1>" +
            "<p style='margin:6px 0 0;opacity:0.95;'>Order " + orderNumber + "</p>" +
            "</div>" +
            "<div style='padding:24px;color:#374151;'>" +
            "<p style='margin:0 0 12px;font-size:15px;'>We're preparing your items. Below is a summary — no further action is required.</p>" +
            "<div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;'>" +
            "<div style='font-size:13px;color:#6b7280;'>Amount to pay</div>" +
            "<div style='font-weight:700;font-size:18px;'>$" + String.format("%.2f", order.getTotalAmount()) + "</div>" +
            "</div>" +
            "<table style='width:100%;border-collapse:collapse;margin-bottom:16px;'>" +
            "<thead><tr style='background:#f9fafb;'>" +
            "<th style='text-align:left;padding:12px 8px;color:#6b7280;font-size:12px;'>Item</th>" +
            "<th style='text-align:center;padding:12px 8px;color:#6b7280;font-size:12px;'>Qty</th>" +
            "<th style='text-align:right;padding:12px 8px;color:#6b7280;font-size:12px;'>Price</th>" +
            "</tr></thead><tbody>" +
            items.toString() +
            "</tbody></table>" +
            "<div style='padding:16px;background:#f9fafb;border-radius:8px;margin-bottom:16px;'>" +
            "<strong style='display:block;margin-bottom:6px;color:#111827;'>Shipping details</strong>" +
            "<div style='color:#374151;font-size:14px;line-height:1.4;'>" + shipping + "</div>" +
            "</div>" +
            "<div style='text-align:center;padding:18px;background:#ffffff;border-top:1px solid #e5e7eb;'>" +
            "<p style='margin:0;color:#6b7280;font-size:13px;'>If you have any questions, reply to this email — we're happy to help.</p>" +
            "</div></div></div></body></html>";

        return html;
    }
}
