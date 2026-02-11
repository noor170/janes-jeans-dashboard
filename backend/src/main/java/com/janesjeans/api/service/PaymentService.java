package com.janesjeans.api.service;

import com.janesjeans.api.entity.Payment;
import com.janesjeans.api.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;

    public Payment createPayment(Payment payment) {
        return paymentRepository.save(payment);
    }

    public List<Payment> getPaymentsForOrder(String orderId) {
        return paymentRepository.findByOrderId(orderId);
    }
}
