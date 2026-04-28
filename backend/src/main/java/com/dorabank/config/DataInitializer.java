package com.dorabank.config;

import com.dorabank.model.User;
import com.dorabank.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Add delay to ensure MongoDB is ready
        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        int maxRetries = 5;
        int retryCount = 0;
        
        while (retryCount < maxRetries) {
            try {
                // Check if admin user exists
                if (!userRepository.existsByEmail("admin@dorabank.com")) {
                    // Create admin user
                    User admin = new User();
                    admin.setEmail("admin@dorabank.com");
                    admin.setPassword(passwordEncoder.encode("Admin123"));
                    admin.setFullName("Dora Bank Admin");
                    admin.setPhone("9876543210");
                    admin.setAddress("Dora Bank Headquarters");
                    admin.setAccountType("admin");
                    admin.setBalance(0.0);
                    userRepository.save(admin);

                    System.out.println("========================================");
                    System.out.println("Default admin user created:");
                    System.out.println("Email: admin@dorabank.com");
                    System.out.println("Password: Admin123");
                    System.out.println("========================================");
                    break;
                } else {
                    System.out.println("Admin user already exists");
                    break;
                }
            } catch (Exception e) {
                retryCount++;
                System.err.println("Attempt " + retryCount + ": Error creating default admin user: " + e.getMessage());
                if (retryCount < maxRetries) {
                    try {
                        Thread.sleep(2000);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                    }
                } else {
                    System.err.println("Failed to create admin user after " + maxRetries + " attempts");
                    e.printStackTrace();
                }
            }
        }
    }
}
