package com.dorabank.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "transactions")
public class Transaction {

    @Id
    private String id;

    @Indexed
    private String accountNumber;

    private String transactionId;

    private String type; // deposit, withdraw, transfer

    private Double amount;

    private String description;

    private String fromAccount; // for transfers

    private String toAccount; // for transfers

    private String status; // pending, completed, failed

    private LocalDateTime transactionDate;

    private LocalDateTime createdAt;

    public Transaction(String accountNumber, String type, Double amount, String description) {
        this.accountNumber = accountNumber;
        this.type = type;
        this.amount = amount;
        this.description = description;
        this.status = "completed";
        this.transactionDate = LocalDateTime.now();
        this.createdAt = LocalDateTime.now();
        this.transactionId = generateTransactionId();
    }

    private String generateTransactionId() {
        return "TXN" + System.currentTimeMillis() + (int)(Math.random() * 1000);
    }
}
