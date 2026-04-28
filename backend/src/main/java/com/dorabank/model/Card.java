package com.dorabank.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "cards")
public class Card {

    @Id
    private String id;

    @Indexed(unique = true)
    private String cardNumber;

    private String userId;

    private String accountNumber;

    private String cardType; // debit, credit

    private String cvv;

    private String expiryDate;

    private String status; // active, blocked, expired

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private LocalDate expiryDateObj;

    public Card(String cardNumber, String userId, String accountNumber, String cardType, String cvv, String expiryDate) {
        this.cardNumber = cardNumber;
        this.userId = userId;
        this.accountNumber = accountNumber;
        this.cardType = cardType;
        this.cvv = cvv;
        this.expiryDate = expiryDate;
        this.status = "active";
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
}
