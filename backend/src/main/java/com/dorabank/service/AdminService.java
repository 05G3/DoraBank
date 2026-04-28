package com.dorabank.service;

import com.dorabank.exception.CustomException;
import com.dorabank.model.User;
import com.dorabank.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers() {
        verifyAdmin();
        List<User> users = userRepository.findAll();
        users.forEach(user -> user.setPassword(null)); // Remove password from response
        return users;
    }

    public User getUserById(String userId) {
        verifyAdmin();
        User user = userRepository.findById(userId != null ? userId : "")
                .orElseThrow(() -> new CustomException("User not found", 404));
        user.setPassword(null);
        return user;
    }

    public User getUserByAccountNumber(String accountNumber) {
        verifyAdmin();
        User user = userRepository.findByAccountNumber(accountNumber != null ? accountNumber : "")
                .orElseThrow(() -> new CustomException("User not found", 404));
        user.setPassword(null);
        return user;
    }

    public void deleteUser(String userId) {
        verifyAdmin();
        if (!userRepository.existsById(userId)) {
            throw new CustomException("User not found", 404);
        }
        userRepository.deleteById(userId != null ? userId : "");
    }

    public Double getTotalBankBalance() {
        verifyAdmin();
        return userRepository.findAll()
                .stream()
                .mapToDouble(User::getBalance)
                .sum();
    }

    public Long getTotalUsersCount() {
        verifyAdmin();
        return userRepository.count();
    }

    private void verifyAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        
        if (!user.getAccountType().equalsIgnoreCase("admin")) {
            throw new CustomException("Access denied. Admin privileges required.", 403);
        }
    }
}
