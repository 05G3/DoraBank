package com.dorabank.repository;

import com.dorabank.model.Transaction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends MongoRepository<Transaction, String> {
    List<Transaction> findByAccountNumberOrderByTransactionDateDesc(String accountNumber);
    List<Transaction> findByAccountNumberAndTypeOrderByTransactionDateDesc(String accountNumber, String type);
}
