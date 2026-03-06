package com.janesjeans.api.config;

import org.springframework.boot.autoconfigure.mail.MailProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.nio.charset.StandardCharsets;
import java.util.Properties;

/**
 * Configures the JavaMailSender bean from properties in application.yml (spring.mail.*).
 */
@Configuration
@EnableConfigurationProperties(MailProperties.class)
public class EmailConfig {

    @Bean
    public JavaMailSender javaMailSender(MailProperties mailProperties) {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        if (mailProperties.getHost() != null) mailSender.setHost(mailProperties.getHost());
        if (mailProperties.getPort() != null) mailSender.setPort(mailProperties.getPort());
        if (mailProperties.getUsername() != null) mailSender.setUsername(mailProperties.getUsername());
        if (mailProperties.getPassword() != null) mailSender.setPassword(mailProperties.getPassword());
        if (mailProperties.getDefaultEncoding() != null) {
            mailSender.setDefaultEncoding(mailProperties.getDefaultEncoding().name());
        } else {
            mailSender.setDefaultEncoding(StandardCharsets.UTF_8.name());
        }

        Properties javaMailProps = mailSender.getJavaMailProperties();
        if (mailProperties.getProperties() != null) {
            javaMailProps.putAll(mailProperties.getProperties());
        }

        return mailSender;
    }
}
