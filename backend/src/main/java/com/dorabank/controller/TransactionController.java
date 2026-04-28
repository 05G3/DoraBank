package com.dorabank.controller;

import com.dorabank.dto.TransactionRequest;
import com.dorabank.model.Transaction;
import com.dorabank.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @PostMapping("/process")
    public ResponseEntity<Transaction> processTransaction(@Valid @RequestBody TransactionRequest request) {
        Transaction transaction = transactionService.processTransaction(request);
        return ResponseEntity.ok(transaction);
    }

    @GetMapping("/current")
    public ResponseEntity<List<Transaction>> getCurrentUserTransactions() {
        List<Transaction> transactions = transactionService.getCurrentUserTransactions();
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/account/{accountNumber}")
    public ResponseEntity<List<Transaction>> getAccountTransactions(@PathVariable String accountNumber) {
        List<Transaction> transactions = transactionService.getAccountTransactions(accountNumber);
        return ResponseEntity.ok(transactions);
    }
}
