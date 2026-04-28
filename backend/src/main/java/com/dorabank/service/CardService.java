package com.dorabank.service;

import com.dorabank.dto.CardRequest;
import com.dorabank.exception.CustomException;
import com.dorabank.model.Card;
import com.dorabank.model.User;
import com.dorabank.repository.CardRepository;
import com.dorabank.util.CardGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class CardService {

    @Autowired
    private CardRepository cardRepository;

    @Autowired
    private CardGenerator cardGenerator;

    public Card requestCard(CardRequest request) {
        User user = getCurrentUser();
        
        if (!user.getAccountNumber().equals(request.getAccountNumber())) {
            throw new CustomException("Unauthorized access to account", 403);
        }

        String cardNumber = cardGenerator.generateCardNumber();
        String cvv = cardGenerator.generateCVV();
        String expiryDate = cardGenerator.generateExpiryDate();

        // Parse expiry date for storage - use first day of month to avoid invalid dates
        int month = Integer.parseInt(expiryDate.substring(0, 2));
        int year = 2000 + Integer.parseInt(expiryDate.substring(3, 5));
        LocalDate expiryDateObj = LocalDate.of(year, month, 1);

        Card card = new Card(cardNumber, user.getId(), request.getAccountNumber(), request.getCardType(), cvv, expiryDate);
        card.setExpiryDateObj(expiryDateObj);
        card = cardRepository.save(card);

        // Return unmasked card number for the owner
        return card;
    }

    public List<Card> getUserCards(String userId) {
        List<Card> cards = cardRepository.findByUserId(userId);
        // Mask card numbers for security
        cards.forEach(card -> card.setCardNumber(cardGenerator.maskCardNumber(card.getCardNumber())));
        return cards;
    }

    public List<Card> getCurrentUserCards() {
        User user = getCurrentUser();
        List<Card> cards = cardRepository.findByUserId(user.getId());
        // Don't mask card numbers for the owner
        return cards;
    }

    public Card getCardById(@NonNull String cardId) {
        Card card = cardRepository.findById(cardId != null ? cardId : "")
                .orElseThrow(() -> new CustomException("Card not found", 404));
        
        User user = getCurrentUser();
        if (!card.getUserId().equals(user.getId() != null ? user.getId() : "")) {
            throw new CustomException("Unauthorized access to card", 403);
        }

        card.setCardNumber(cardGenerator.maskCardNumber(card.getCardNumber()));
        return card;
    }

    public void blockCard(String cardId) {
        Card card = cardRepository.findById(cardId != null ? cardId : "")
                .orElseThrow(() -> new CustomException("Card not found", 404));
        
        User user = getCurrentUser();
        if (!card.getUserId().equals(user.getId() != null ? user.getId() : "")) {
            throw new CustomException("Unauthorized access to card", 403);
        }

        card.setStatus("blocked");
        card.setUpdatedAt(LocalDateTime.now());
        cardRepository.save(card);
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (User) authentication.getPrincipal();
    }
}
