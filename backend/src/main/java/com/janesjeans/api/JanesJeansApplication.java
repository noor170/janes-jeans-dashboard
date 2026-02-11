package com.janesjeans.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class JanesJeansApplication {

    public static void main(String[] args) {
        SpringApplication.run(JanesJeansApplication.class, args);
    }
}
