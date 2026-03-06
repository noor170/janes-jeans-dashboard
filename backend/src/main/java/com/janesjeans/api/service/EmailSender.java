package com.janesjeans.api.service;

import com.janesjeans.api.entity.Order;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailSender {

    private final OrderService orderService;
    private final EmailService emailService;

    /**
     * Send an order confirmation email for an existing order by id.
     * This method delegates to EmailService asynchronously.
     */
    public void confirmOrderByEmail(String orderId) {
        Order order = orderService.getOrderById(orderId);
        String orderNumber = "ORD-" + order.getId().substring(0, Math.min(8, order.getId().length())).toUpperCase();
        log.info("Triggering confirmation email for order {} ({})", orderId, orderNumber);
        String html = emailService.buildConfirmOrderByEmailMessage(order, orderNumber);
        emailService.sendCustomOrderConfirmationAsync(order, orderNumber, html);
    }
}
