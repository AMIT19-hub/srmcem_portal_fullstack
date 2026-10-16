package com.example.srmcemportal.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOtp(String email, String otp) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom(fromEmail);
        message.setTo(email);
        message.setSubject(
                "SRMCEM Placement Portal - Email Verification");

        message.setText(
                "Hello,\n\n"
                + "Your email verification OTP is: " + otp + "\n\n"
                + "This OTP expires in 5 minutes.\n"
                + "Do not share this OTP with anyone.\n\n"
                + "SRMCEM Placement Portal"
        );

        mailSender.send(message);
    }
}