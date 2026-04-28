package com.dorabank.controller;

import com.dorabank.dto.CardRequest;
import com.dorabank.model.Card;
import com.dorabank.service.CardService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cards")
@CrossOrigin(origins = "*")
public class CardController {

    @Autowired
    private CardService cardService;

    @PostMapping("/request")
    public ResponseEntity<Card> requestCard(@Valid @RequestBody CardRequest request) {
        Card card = cardService.requestCard(request);
        return ResponseEntity.ok(card);
    }

    @GetMapping("/current")
    public ResponseEntity<List<Card>> getCurrentUserCards() {
        List<Card> cards = cardService.getCurrentUserCards();
        return ResponseEntity.ok(cards);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Card>> getUserCards(@PathVariable String userId) {
        List<Card> cards = cardService.getUserCards(userId);
        return ResponseEntity.ok(cards);
    }

    @GetMapping("/{cardId}")
    public ResponseEntity<Card> getCardById(@PathVariable String cardId) {
        Card card = cardService.getCardById(cardId);
        return ResponseEntity.ok(card);
    }

    @PutMapping("/{cardId}/block")
    public ResponseEntity<Void> blockCard(@PathVariable String cardId) {
        cardService.blockCard(cardId);
        return ResponseEntity.ok().build();
    }
}
