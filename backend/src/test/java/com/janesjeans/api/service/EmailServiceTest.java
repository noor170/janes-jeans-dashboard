package com.janesjeans.api.service;

import com.janesjeans.api.entity.Order;
import com.janesjeans.api.entity.OrderItem;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.mail.javamail.JavaMailSender;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmailServiceTest {

    @Mock
    private JavaMailSender mailSender;

    @Mock
    private MimeMessage mimeMessage;

    @InjectMocks
    private EmailService emailService;

    @BeforeEach
    void setUp() {
        // make stub lenient so unused stubbings in wider test-suite don't fail
        lenient().when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
        // @Value won't be processed for @InjectMocks; ensure a valid from address for tests
        ReflectionTestUtils.setField(emailService, "fromEmail", "noreply@janesjeans.com");
    }

    @Test
    void sendOrderConfirmation_shouldSendEmail() throws Exception {
        Order order = Order.builder()
                .id("ord-1")
                .customerName("John Doe")
                .customerEmail("john@test.com")
                .totalAmount(new BigDecimal("89.99"))
                .shippingAddress("123 Main St, Dhaka 1200")
                .items(new ArrayList<>())
                .build();

        OrderItem item = OrderItem.builder()
                .productName("Slim Jeans")
                .size("32")
                .quantity(1)
                .price(new BigDecimal("89.99"))
                .build();
        order.getItems().add(item);

        emailService.sendOrderConfirmation(order, "ORD-ABCD1234");

        verify(mailSender, times(1)).send(any(MimeMessage.class));
    }

    @Test
    void sendOrderConfirmation_shouldSkipWhenNoEmail() throws Exception {
        Order order = Order.builder()
                .id("ord-2")
                .customerName("No Email User")
                .customerEmail(null)
                .totalAmount(new BigDecimal("50.00"))
                .items(new ArrayList<>())
                .build();

        emailService.sendOrderConfirmation(order, "ORD-XXXX");

        verify(mailSender, never()).send(any(MimeMessage.class));
    }

    @Test
    void sendOrderConfirmation_shouldSkipWhenBlankEmail() throws Exception {
        Order order = Order.builder()
                .id("ord-3")
                .customerName("Blank Email")
                .customerEmail("   ")
                .totalAmount(new BigDecimal("30.00"))
                .items(new ArrayList<>())
                .build();

        emailService.sendOrderConfirmation(order, "ORD-YYYY");

        verify(mailSender, never()).send(any(MimeMessage.class));
    }
}
