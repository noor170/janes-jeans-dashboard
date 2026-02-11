package com.janesjeans.api.config;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.security.SecureRandom;

/**
 * Lightweight SMS configuration and service for creating/sending OTPs.
 *
 * This class binds properties under `sms` in application.yml and exposes a
 * simple `SmsService` bean. The default implementation logs messages; you can
 * replace the sending logic to integrate with Twilio, AWS SNS, or another SMS
 * provider.
 */
@Configuration
@EnableConfigurationProperties(SMSConfige.SmsProperties.class)
@Slf4j
public class SMSConfige {

    @Bean
    public SmsService smsService(SmsProperties props) {
        return new SmsService(props);
    }

    @Data
    @ConfigurationProperties(prefix = "sms")
    public static class SmsProperties {
        /** Provider identifier, e.g. twilio, sns or 'log' */
        private String provider = "log";
        private boolean enabled = false;
        private String apiKey;
        private String apiSecret;
        private String fromNumber;
        private int otpLength = 6;
        private int otpTtlSeconds = 300;
    }

    /**
     * Simple service for OTP generation and sending.
     * Replace the send implementation to actually call an SMS provider.
     */
    public static class SmsService {
        private final SmsProperties props;
        private final SecureRandom random = new SecureRandom();

        public SmsService(SmsProperties props) {
            this.props = props;
        }

        public String generateOtp() {
            int length = Math.max(4, props.getOtpLength());
            int max = (int) Math.pow(10, length);
            int value = random.nextInt(max - (max/10)) + (max/10);
            return String.format("%0" + length + "d", value);
        }

        /**
         * Send an OTP to the provided phone number. Currently logs and returns the OTP.
         * Integrate with your SMS gateway here when ready.
         */
        public String sendOtp(String phoneNumber) {
            String otp = generateOtp();
            if (!props.isEnabled()) {
                log.info("SMS disabled - OTP for {} is {} (not sent)", phoneNumber, otp);
                return otp;
            }

            // Placeholder: integrate with an SMS provider (Twilio, SNS, etc.) here.
            // Example (pseudo): twilioClient.messages.create(...)
            log.info("Sending OTP {} to {} via provider {}", otp, phoneNumber, props.getProvider());

            return otp;
        }
    }
}
