package com.dorabank.repository;

import com.dorabank.model.Account;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends MongoRepository<Account, String> {
    Optional<Account> findByAccountNumber(String accountNumber);
    List<Account> findByUserId(String userId);
    boolean existsByAccountNumber(String accountNumber);
}
