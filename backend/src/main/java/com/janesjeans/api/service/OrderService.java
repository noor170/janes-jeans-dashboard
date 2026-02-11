package com.janesjeans.api.service;

import com.janesjeans.api.entity.Order;
import com.janesjeans.api.entity.OrderItem;
import com.janesjeans.api.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;

    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByOrderDateDesc();
    }

    public Order getOrderById(String id) {
        return orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
    }

    @Transactional
    public Order createOrder(Order order) {
        if (order.getItems() != null) {
            for (OrderItem item : order.getItems()) {
                item.setOrder(order);
            }
        }
        return orderRepository.save(order);
    }

    @Transactional
    public Order updateOrder(String id, Order updates) {
        Order order = getOrderById(id);
        if (updates.getCustomerName() != null) order.setCustomerName(updates.getCustomerName());
        if (updates.getCustomerEmail() != null) order.setCustomerEmail(updates.getCustomerEmail());
        if (updates.getStatus() != null) order.setStatus(updates.getStatus());
        if (updates.getShippingAddress() != null) order.setShippingAddress(updates.getShippingAddress());
        if (updates.getNotes() != null) order.setNotes(updates.getNotes());
        if (updates.getTotalAmount() != null) order.setTotalAmount(updates.getTotalAmount());
        return orderRepository.save(order);
    }

    public Order updateOrderStatus(String id, String status) {
        Order order = getOrderById(id);
        order.setStatus(status);
        if ("Shipped".equals(status)) {
            order.setShippedDate(LocalDateTime.now());
        } else if ("Delivered".equals(status)) {
            order.setDeliveredDate(LocalDateTime.now());
        }
        return orderRepository.save(order);
    }

    public void deleteOrder(String id) {
        orderRepository.deleteById(id);
    }
}
