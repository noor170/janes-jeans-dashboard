package com.janesjeans.api.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final UserDetailsService userDetailsService;
    private final CorsConfigurationSource corsConfigurationSource;
//
//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        http
//                // 1. Core Protections
//                .csrf(AbstractHttpConfigurer::disable)
//                .cors(cors -> cors.configurationSource(corsConfigurationSource))
//
//                // 2. Authorization Rules
//                .authorizeHttpRequests(auth -> auth
//                        // Consolidated Whitelist
//                        .requestMatchers(
//                            "/api/auth/**",
//                            "/api/health",
//                            "/h2-console/**",
//                            "/actuator/**",
//                            "/swagger-ui/**",
//                            "/v3/api-docs/**",
//                            "/api/shop/**"
//                        ).permitAll()
//
//                        // Public order-related endpoints (guest flows)
//                        .requestMatchers(
//                            "/api/orders/*/confirm-email",
//                            "/api/orders/*/request-otp",
//                            "/api/orders/*/verify-otp",
//                            "/api/orders/*/skip-verify",
//                            "/api/orders/guest-checkout/**"
//                        ).permitAll()
//
//                        // Guest Checkout flow (Steps 4 & 5 of your activity flow)
//                        .requestMatchers("/api/orders/guest-checkout/**").permitAll()
//
//                        // If you want specific POST methods to be authenticated, place them ABOVE anyRequest()
//                        // Example: .requestMatchers(HttpMethod.POST, "/api/orders/place").authenticated()
//
//                        // 3. Catch-all: Everything else requires login
//                        .anyRequest().authenticated()
//                )
//
//                // 4. Session & JWT Configuration
//                .sessionManagement(session -> session
//                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
//                )
//                .authenticationProvider(authenticationProvider())
//                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
//
//                // 5. H2 Console & Browser Frame Support
//                .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()));
//
//        return http.build();
//    }


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // This is the crucial line for Postman
                .authorizeHttpRequests(auth -> auth
//                        .requestMatchers( "/api/orders/**").permitAll()
                        .requestMatchers("/api/orders/**", "/error").permitAll()
                        .anyRequest().permitAll()
                );
        return http.build();
    }
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
