package com.dorabank.service;

import com.dorabank.dto.TransactionRequest;
import com.dorabank.exception.CustomException;
import com.dorabank.model.Transaction;
import com.dorabank.model.User;
import com.dorabank.repository.TransactionRepository;
import com.dorabank.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AccountService accountService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public Transaction processTransaction(TransactionRequest request) {
        User user = getCurrentUser();
        
        if (!user.getAccountNumber().equals(request.getAccountNumber())) {
            throw new CustomException("Unauthorized access to account", 403);
        }

        Transaction transaction = new Transaction(request.getAccountNumber(), request.getType(), request.getAmount(), request.getDescription());

        switch (request.getType().toLowerCase()) {
            case "deposit":
                deposit(request.getAccountNumber(), request.getAmount());
                break;
            case "withdraw":
                withdraw(request.getAccountNumber(), request.getAmount());
                break;
            case "transfer":
                if (request.getToAccount() == null || request.getToAccount().isEmpty()) {
                    throw new CustomException("Destination account is required for transfer", 400);
                }
                transfer(request.getAccountNumber(), request.getToAccount(), request.getAmount());
                transaction.setToAccount(request.getToAccount());
                break;
            default:
                throw new CustomException("Invalid transaction type", 400);
        }

        transaction = transactionRepository.save(transaction);
        
        // Send real-time notification
        String accountNumber = request.getAccountNumber() != null ? request.getAccountNumber() : "";
        messagingTemplate.convertAndSend("/topic/transactions/" + accountNumber, transaction);
        messagingTemplate.convertAndSend("/topic/balance/" + accountNumber, accountService.getAccountByNumber(accountNumber));

        return transaction;
    }

    private void deposit(String accountNumber, Double amount) {
        User user = userRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new CustomException("Account not found", 404));
        user.setBalance(user.getBalance() + amount);
        userRepository.save(user);
    }

    private void withdraw(String accountNumber, Double amount) {
        User user = userRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new CustomException("Account not found", 404));
        
        if (user.getBalance() < amount) {
            throw new CustomException("Insufficient balance", 400);
        }
        
        user.setBalance(user.getBalance() - amount);
        userRepository.save(user);
    }

    private void transfer(String fromAccount, String toAccount, Double amount) {
        withdraw(fromAccount, amount);
        deposit(toAccount, amount);

        // Create corresponding transaction for receiver
        Transaction receiverTransaction = new Transaction(toAccount, "deposit", amount, "Transfer from " + fromAccount);
        receiverTransaction.setFromAccount(fromAccount);
        transactionRepository.save(receiverTransaction);

        String safeToAccount = toAccount != null ? toAccount : "";
        messagingTemplate.convertAndSend("/topic/transactions/" + safeToAccount, receiverTransaction);
        messagingTemplate.convertAndSend("/topic/balance/" + safeToAccount, accountService.getAccountByNumber(safeToAccount));
    }

    public List<Transaction> getAccountTransactions(String accountNumber) {
        return transactionRepository.findByAccountNumberOrderByTransactionDateDesc(accountNumber);
    }

    public List<Transaction> getCurrentUserTransactions() {
        User user = getCurrentUser();
        return getAccountTransactions(user.getAccountNumber());
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (User) authentication.getPrincipal();
    }
}
