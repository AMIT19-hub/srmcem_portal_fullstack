
package com.example.srmcemportal.config;

import com.example.srmcemportal.entity.Role;
import com.example.srmcemportal.entity.User;
import com.example.srmcemportal.repository.UserRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminConfig {

    @Bean
    CommandLineRunner createAdmin(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            String adminEmail = "admin@srmcem.com";

            if (!userRepository.existsByEmail(adminEmail)) {

                User admin = new User();

                admin.setName("Admin");
                admin.setEmail(adminEmail);
                admin.setPassword(
                        passwordEncoder.encode("admin123"));
                admin.setRole(Role.ADMIN);

                // Admin does not need email OTP verification.
                admin.setEmailVerified(true);
                admin.setActive(true);

                userRepository.save(admin);

                System.out.println(
                        "Admin account created successfully");
            } else {
                System.out.println(
                        "Admin account already exists");
            }
        };
    }
}
