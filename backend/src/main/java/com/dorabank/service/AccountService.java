package com.dorabank.service;

import com.dorabank.exception.CustomException;
import com.dorabank.model.Account;
import com.dorabank.model.User;
import com.dorabank.repository.AccountRepository;
import com.dorabank.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private UserRepository userRepository;

    public Account getAccountByNumber(String accountNumber) {
        return accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new CustomException("Account not found", 404));
    }

    public List<Account> getUserAccounts(String userId) {
        return accountRepository.findByUserId(userId);
    }

    public Account getCurrentUserAccount() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        return accountRepository.findByAccountNumber(user.getAccountNumber())
                .orElseThrow(() -> new CustomException("Account not found", 404));
    }

    public Account updateBalance(String accountNumber, Double newBalance) {
        Account account = getAccountByNumber(accountNumber);
        account.setBalance(newBalance);
        account.setUpdatedAt(LocalDateTime.now());
        return accountRepository.save(account);
    }
}
