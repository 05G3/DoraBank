package com.dorabank.util;

import org.springframework.stereotype.Component;

import java.security.SecureRandom;
import java.util.HashSet;
import java.util.Set;

@Component
public class AccountNumberGenerator {

    private static final SecureRandom random = new SecureRandom();
    private static final Set<String> generatedNumbers = new HashSet<>();

    public String generateAccountNumber(String accountType) {
        String prefix = accountType.equalsIgnoreCase("savings") ? "DORA-SAV" : "DORA-CUR";
        String accountNumber;
        
        do {
            accountNumber = prefix + "-" + generateRandomDigits(8);
        } while (generatedNumbers.contains(accountNumber));
        
        generatedNumbers.add(accountNumber);
        return accountNumber;
    }

    private String generateRandomDigits(int length) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < length; i++) {
            sb.append(random.nextInt(10));
        }
        return sb.toString();
    }

    public static void main(String[] args) {
        AccountNumberGenerator generator = new AccountNumberGenerator();
        System.out.println("Savings: " + generator.generateAccountNumber("savings"));
        System.out.println("Current: " + generator.generateAccountNumber("current"));
    }
}
