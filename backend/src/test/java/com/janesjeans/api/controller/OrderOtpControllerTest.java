package com.janesjeans.api.controller;

import com.janesjeans.api.service.OtpService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class OrderOtpControllerTest {

    @Test
    void requestOtp_returnsAccepted() throws Exception {
        OtpService mock = Mockito.mock(OtpService.class);
        Mockito.when(mock.requestOtp(Mockito.eq("order1"), Mockito.anyString(), Mockito.eq(300), Mockito.anyString(), Mockito.any())).thenReturn("123456");

        OrderOtpController controller = new OrderOtpController(mock);
        MockMvc mvc = MockMvcBuilders.standaloneSetup(controller).build();

        mvc.perform(post("/api/orders/order1/request-otp")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"phoneNumber\":\"01123456789\",\"method\":\"sms\"}"))
            .andExpect(status().isAccepted());
    }

    @Test
    void verifyOtp_returnsOkWhenVerified() throws Exception {
        OtpService mock = Mockito.mock(OtpService.class);
        Mockito.when(mock.verifyOtp(Mockito.eq("order1"), Mockito.eq("01123456789"), Mockito.eq("123456"))).thenReturn(true);
        OrderOtpController controller = new OrderOtpController(mock);
        MockMvc mvc = MockMvcBuilders.standaloneSetup(controller).build();

        mvc.perform(post("/api/orders/order1/verify-otp")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"phoneNumber\":\"01123456789\",\"otp\":\"123456\"}"))
            .andExpect(status().isOk());
    }
}
