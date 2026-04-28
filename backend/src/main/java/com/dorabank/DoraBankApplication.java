package com.dorabank;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DoraBankApplication {

    public static void main(String[] args) {
        SpringApplication.run(DoraBankApplication.class, args);
        System.out.println("DoraBank Banking System Started Successfully!");
    }
}
