package com.dorabank.repository;

import com.dorabank.model.Card;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CardRepository extends MongoRepository<Card, String> {
    Optional<Card> findByCardNumber(String cardNumber);
    List<Card> findByUserId(String userId);
    List<Card> findByAccountNumber(String accountNumber);
    boolean existsByCardNumber(String cardNumber);
}
