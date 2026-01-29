package com.janesjeans.service;

import com.janesjeans.entity.Order;
import com.janesjeans.entity.OrderItem;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${spring.mail.username:noreply@janesjeans.com}")
    private String fromEmail;

    @Value("${app.name:Jane's Jeans}")
    private String appName;

    public void sendOrderConfirmation(Order order) throws MessagingException {
        log.info("Sending order confirmation email to {}", order.getShipmentDetails().getEmail());

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(order.getShipmentDetails().getEmail());
        helper.setSubject("Order Confirmation - " + order.getOrderNumber());

        // Build email content
        Context context = new Context();
        context.setVariable("orderNumber", order.getOrderNumber());
        context.setVariable("customerName", order.getShipmentDetails().getName());
        context.setVariable("items", order.getItems());
        context.setVariable("totalAmount", order.getTotalAmount());
        context.setVariable("shippingAddress", formatAddress(order));
        context.setVariable("paymentMethod", order.getPaymentType().name());
        context.setVariable("appName", appName);

        String htmlContent = templateEngine.process("order-confirmation", context);
        helper.setText(htmlContent, true);

        mailSender.send(message);
        log.info("Order confirmation email sent successfully");
    }

    // Simple text-based email as fallback
    public void sendSimpleOrderConfirmation(Order order) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(order.getShipmentDetails().getEmail());
        helper.setSubject("Order Confirmation - " + order.getOrderNumber());

        StringBuilder content = new StringBuilder();
        content.append("Thank you for your order!\n\n");
        content.append("Order Number: ").append(order.getOrderNumber()).append("\n\n");
        content.append("Items:\n");
        
        for (OrderItem item : order.getItems()) {
            content.append("- ").append(item.getProductName())
                   .append(" (").append(item.getSize()).append(")")
                   .append(" x").append(item.getQuantity())
                   .append(" - $").append(item.getSubtotal())
                   .append("\n");
        }
        
        content.append("\nTotal: $").append(order.getTotalAmount()).append("\n\n");
        content.append("Shipping Address:\n").append(formatAddress(order)).append("\n\n");
        content.append("Thank you for shopping with Jane's Jeans!");

        helper.setText(content.toString());
        mailSender.send(message);
    }

    private String formatAddress(Order order) {
        return String.format("%s\n%s\n%s, %s\n%s",
                order.getShipmentDetails().getName(),
                order.getShipmentDetails().getAddress(),
                order.getShipmentDetails().getCity(),
                order.getShipmentDetails().getPostalCode(),
                order.getShipmentDetails().getPhone());
    }
}
