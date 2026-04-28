package com.dorabank.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String type;
    private String userId;
    private String email;
    private String accountNumber;
    private String accountType;
    private Double balance;
    private String fullName;
}
