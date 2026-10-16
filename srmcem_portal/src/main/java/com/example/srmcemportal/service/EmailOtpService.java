package com.example.srmcemportal.service;

import com.example.srmcemportal.entity.EmailOtp;
import com.example.srmcemportal.repository.EmailOtpRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
public class EmailOtpService {

    private final EmailOtpRepository emailOtpRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    private final SecureRandom secureRandom = new SecureRandom();

    @Value("${app.otp.expiry-minutes:5}")
    private int expiryMinutes;

    public EmailOtpService(
            EmailOtpRepository emailOtpRepository,
            PasswordEncoder passwordEncoder,
            EmailService emailService) {
        this.emailOtpRepository = emailOtpRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    @Transactional
    public void sendOtp(String email) {

        String normalizedEmail = email.trim().toLowerCase();

        String otp = String.format(
                "%06d", secureRandom.nextInt(1_000_000));

        EmailOtp emailOtp = emailOtpRepository
                .findByEmail(normalizedEmail)
                .orElseGet(EmailOtp::new);

        emailOtp.setEmail(normalizedEmail);
        emailOtp.setOtpHash(passwordEncoder.encode(otp));
        emailOtp.setExpiresAt(
                LocalDateTime.now().plusMinutes(expiryMinutes));
        emailOtp.setAttempts(0);
        emailOtp.setUsed(false);

        emailOtpRepository.save(emailOtp);

        // Send the actual OTP by email.
        emailService.sendOtp(normalizedEmail, otp);
    }

    @Transactional
    public boolean verifyOtp(String email, String otp) {

        String normalizedEmail = email.trim().toLowerCase();

        EmailOtp emailOtp = emailOtpRepository
                .findByEmail(normalizedEmail)
                .orElse(null);

        if (emailOtp == null || emailOtp.isUsed()) {
            return false;
        }

        if (LocalDateTime.now().isAfter(emailOtp.getExpiresAt())) {
            emailOtpRepository.delete(emailOtp);
            return false;
        }

        if (emailOtp.getAttempts() >= 5) {
            emailOtpRepository.delete(emailOtp);
            return false;
        }

        emailOtp.setAttempts(emailOtp.getAttempts() + 1);

        if (!passwordEncoder.matches(otp, emailOtp.getOtpHash())) {
            emailOtpRepository.save(emailOtp);
            return false;
        }

        emailOtp.setUsed(true);
        emailOtpRepository.save(emailOtp);

        return true;
    }
}