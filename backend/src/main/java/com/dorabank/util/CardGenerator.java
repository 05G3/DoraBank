package com.dorabank.util;

import org.springframework.stereotype.Component;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Component
public class CardGenerator {

    private static final SecureRandom random = new SecureRandom();

    public String generateCardNumber() {
        StringBuilder cardNumber = new StringBuilder();
        
        for (int i = 0; i < 16; i++) {
            cardNumber.append(random.nextInt(10));
        }
        
        return cardNumber.toString();
    }

    public String generateCVV() {
        return String.format("%03d", random.nextInt(1000));
    }

    public String generateExpiryDate() {
        LocalDate expiryDate = LocalDate.now()
                .plusYears(3 + random.nextInt(3)) // 3-5 years from now
                .withDayOfMonth(1); // Set to first day of the month to avoid invalid dates
        return expiryDate.format(DateTimeFormatter.ofPattern("MM/yy"));
    }

    public String maskCardNumber(String cardNumber) {
        String cleaned = cardNumber.replaceAll("\\s", "");
        if (cleaned.length() < 16) {
            return cardNumber;
        }
        return "**** **** **** " + cleaned.substring(12);
    }
}
