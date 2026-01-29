package com.janesjeans.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ShipmentDetailsResponse {

    private String name;
    private String email;
    private String phone;
    private String address;
    private String city;
    private String postalCode;
}
