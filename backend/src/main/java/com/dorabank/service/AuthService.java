package com.dorabank.service;

import com.dorabank.dto.AuthRequest;
import com.dorabank.dto.AuthResponse;
import com.dorabank.dto.RegisterRequest;
import com.dorabank.exception.CustomException;
import com.dorabank.model.User;
import com.dorabank.repository.UserRepository;
import com.dorabank.security.JwtUtil;
import com.dorabank.util.AccountNumberGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private AccountNumberGenerator accountNumberGenerator;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new CustomException("Email already registered", 400);
        }

        String accountNumber = accountNumberGenerator.generateAccountNumber(request.getAccountType());

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        user.setAccountType(request.getAccountType());
        user.setAccountNumber(accountNumber);
        user.setBalance(request.getInitialBalance());
        user.setCreatedAt(LocalDateTime.now());

        user = userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getId(), user.getAccountNumber(), user.getAccountType());

        return new AuthResponse(token, "Bearer", user.getId(), user.getEmail(), user.getAccountNumber(), user.getAccountType(), user.getBalance(), user.getFullName());
    }

    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = (User) authentication.getPrincipal();
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getId(), user.getAccountNumber(), user.getAccountType());

        return new AuthResponse(token, "Bearer", user.getId(), user.getEmail(), user.getAccountNumber(), user.getAccountType(), user.getBalance(), user.getFullName());
    }
}
