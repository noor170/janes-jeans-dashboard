package com.janesjeans.api.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.responses.ApiResponse;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        final String securitySchemeName = "bearerAuth";

        Components components = new Components()
                .addSecuritySchemes(securitySchemeName, new SecurityScheme()
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT")
                )
                .addResponses("BadRequest", new ApiResponse().description("Bad Request"))
                .addResponses("Unauthorized", new ApiResponse().description("Unauthorized"))
                .addResponses("Forbidden", new ApiResponse().description("Forbidden"))
                .addResponses("NotFound", new ApiResponse().description("Not Found"))
                .addResponses("InternalError", new ApiResponse().description("Internal Server Error"));

        return new OpenAPI()
                .components(components)
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .info(new Info()
                        .title("Jane's Jeans API")
                        .version("1.0.0")
                        .description("API documentation for Jane's Jeans backend (includes response details).")
                        .contact(new Contact().name("Jane's Jeans API Team").email("devops@janesjeans.com"))
                        .license(new License().name("MIT"))
                );
    }
}
package com.janesjeans.api.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Value("${server.port:8080}")
    private int serverPort;

    @Bean
    public OpenAPI customOpenAPI() {
        final String securitySchemeName = "bearerAuth";

        return new OpenAPI()
                .info(new Info()
                        .title("Jane's Jeans API")
                        .version("1.0.0")
                        .description("REST API for Jane's Jeans e-commerce platform. "
                                + "Includes public shop endpoints, authenticated admin endpoints, "
                                + "and user management.")
                        .contact(new Contact()
                                .name("Jane's Jeans Dev Team")
                                .email("dev@janesjeans.com"))
                        .license(new License()
                                .name("MIT")
                                .url("https://opensource.org/licenses/MIT")))
                .servers(List.of(
                        new Server().url("http://localhost:" + serverPort).description("Local Dev"),
                        new Server().url("https://api.janesjeans.com").description("Production")))
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName,
                                new SecurityScheme()
                                        .name(securitySchemeName)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Enter your JWT token")));
    }
}
