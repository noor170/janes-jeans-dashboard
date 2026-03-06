package com.janesjeans.api.controller;

import com.janesjeans.api.service.OtpService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderOtpController {

    private final OtpService otpService;

    public static record RequestOtpRequest(String phoneNumber, String method) {}
    public static record VerifyOtpRequest(String phoneNumber, String otp) {}

    @Operation(summary = "Request OTP for order confirmation")
    @ApiResponses({@ApiResponse(responseCode = "202", description = "OTP sent/accepted"), @ApiResponse(responseCode = "400", description = "Invalid input")})
    @PostMapping("/{id}/request-otp")
    public ResponseEntity<Map<String, Object>> requestOtp(@PathVariable("id") String id, @RequestBody RequestOtpRequest body) {
        String to = body.phoneNumber();
        String method = body.method() == null ? "sms" : body.method();
        // default ttl 300s
        String otp = otpService.requestOtp(id, to, 300, method, null);
        return ResponseEntity.accepted().body(Map.of("message", "OTP requested", "orderId", id, "method", method));
    }

    @Operation(summary = "Verify OTP for order confirmation")
    @ApiResponses({@ApiResponse(responseCode = "200", description = "OTP verified"), @ApiResponse(responseCode = "400", description = "Invalid OTP or request")})
    @PostMapping("/{id}/verify-otp")
    public ResponseEntity<Map<String, Object>> verifyOtp(@PathVariable("id") String id, @RequestBody VerifyOtpRequest body) {
        boolean ok = otpService.verifyOtp(id, body.phoneNumber(), body.otp());
        if (ok) return ResponseEntity.ok(Map.of("message", "OTP verified", "orderId", id));
        return ResponseEntity.badRequest().body(Map.of("message", "Invalid or expired OTP"));
    }

    @Operation(summary = "Finalize pending order without OTP (skip verification)")
    @ApiResponses({@ApiResponse(responseCode = "200", description = "Finalized"), @ApiResponse(responseCode = "404", description = "Not found")})
    @PostMapping("/{id}/skip-verify")
    public ResponseEntity<Map<String, Object>> skipVerify(@PathVariable("id") String id) {
        boolean ok = otpService.finalizePending(id);
        if (ok) return ResponseEntity.ok(Map.of("message", "Order finalized without OTP", "orderId", id));
        return ResponseEntity.status(404).body(Map.of("message", "No pending verification found for order"));
    }
}
