package com.dorabank.websocket;

import com.dorabank.model.Transaction;
import com.dorabank.model.Account;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void sendTransactionUpdate(String accountNumber, Transaction transaction) {
        messagingTemplate.convertAndSend("/topic/transactions/" + accountNumber, transaction);
    }

    public void sendBalanceUpdate(String accountNumber, Account account) {
        messagingTemplate.convertAndSend("/topic/balance/" + accountNumber, account);
    }

    public void sendNotification(String accountNumber, String message) {
        messagingTemplate.convertAndSend("/topic/notifications/" + accountNumber, message);
    }
}
