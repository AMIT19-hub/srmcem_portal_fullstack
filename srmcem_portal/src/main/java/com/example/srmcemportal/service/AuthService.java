
package com.example.srmcemportal.service;

import com.example.srmcemportal.dto.ForgotPasswordRequest;
import com.example.srmcemportal.dto.LoginRequest;
import com.example.srmcemportal.dto.RegisterRequest;
import com.example.srmcemportal.dto.ResetPasswordRequest;
import com.example.srmcemportal.entity.PendingRegistration;
import com.example.srmcemportal.entity.Role;
import com.example.srmcemportal.entity.User;
import com.example.srmcemportal.repository.PendingRegistrationRepository;
import com.example.srmcemportal.repository.UserRepository;
import com.example.srmcemportal.security.JwtService;

import com.example.srmcemportal.validation.CollegeEmailValidator;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PendingRegistrationRepository pendingRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailOtpService emailOtpService;

    public AuthService(
            UserRepository userRepository,
            PendingRegistrationRepository pendingRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            EmailOtpService emailOtpService) {

        this.userRepository = userRepository;
        this.pendingRepository = pendingRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.emailOtpService = emailOtpService;
    }

    //  Start registration. Do not save a User here.
    @Transactional
    public String register(RegisterRequest request) {

        if (request.getRole() == null) {
            throw new RuntimeException("Role is required");
        }

        if (request.getRole() == Role.ADMIN) {
            throw new RuntimeException("Admin registration not allowed");
        }

        String email = request.getEmail().trim().toLowerCase();
        if (request.getRole() == Role.STUDENT
                && !CollegeEmailValidator.isValid(email)) {
            throw new RuntimeException(
                    "use college mail id to register");
        }

        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already registered");
        }

        if (request.getRole() == Role.STUDENT) {

            if (request.getCourse() == null
                    || request.getCourse().isBlank()) {
                throw new RuntimeException("Course is required");
            }

            if (request.getRollNo() == null
                    || !request.getRollNo().matches("\\d{13}")) {
                throw new RuntimeException(
                        "Roll number must contain exactly 13 digits");
            }
        }

        if (request.getRole() == Role.RECRUITER) {

            if (request.getCompanyName() == null
                    || request.getCompanyName().isBlank()) {
                throw new RuntimeException("Company name is required");
            }
        }

        PendingRegistration pending = pendingRepository
                .findByEmail(email)
                .orElseGet(PendingRegistration::new);

        pending.setName(request.getName().trim());
        pending.setEmail(email);
        pending.setPassword(
                passwordEncoder.encode(request.getPassword()));
        pending.setRole(request.getRole());
        pending.setExpiresAt(LocalDateTime.now().plusMinutes(10));

        if (request.getRole() == Role.STUDENT) {
            pending.setCourse(request.getCourse().trim());
            pending.setRollNo(request.getRollNo());

            int yearSuffix = Integer.parseInt(
                    request.getRollNo().substring(0, 2));

            pending.setAdmissionYear(2000 + yearSuffix);
            pending.setCompanyName(null);
            pending.setDesignation(null);
        }

        if (request.getRole() == Role.RECRUITER) {
            pending.setCompanyName(request.getCompanyName().trim());
            pending.setDesignation(request.getDesignation());
            pending.setCourse(null);
            pending.setRollNo(null);
            pending.setAdmissionYear(null);
        }

        pendingRepository.save(pending);

        // OTP is sent, but no User record is created yet.
        emailOtpService.sendOtp(email);

        return "OTP sent to your email. Verify it to complete registration.";
    }

    // Create the User only after successful OTP verification.

    @Transactional
    public String verifyRegistrationOtp(String email, String otp) {

        String normalizedEmail = email.trim().toLowerCase();

        PendingRegistration pending = pendingRepository
                .findByEmail(normalizedEmail)
                .orElseThrow(() -> new RuntimeException(
                        "No pending registration found. Please register again."));

        if (LocalDateTime.now().isAfter(pending.getExpiresAt())) {
            pendingRepository.deleteByEmail(normalizedEmail);
            throw new RuntimeException(
                    "Registration expired. Please register again.");
        }

        if (userRepository.existsByEmail(normalizedEmail)) {
            pendingRepository.deleteByEmail(normalizedEmail);
            throw new RuntimeException("Email already registered");
        }

        boolean valid = emailOtpService.verifyOtp(normalizedEmail, otp);

        if (!valid) {
            throw new RuntimeException(
                    "Invalid or expired OTP. Please try again.");
        }

        User user = new User();
        user.setName(pending.getName());
        user.setEmail(pending.getEmail());

        // Password is already encoded in PendingRegistration.
        user.setPassword(pending.getPassword());
        user.setRole(pending.getRole());

        user.setActive(true);
        user.setEmailVerified(true);

        if (pending.getRole() == Role.STUDENT) {
            user.setCourse(pending.getCourse());
            user.setRollNo(pending.getRollNo());
            user.setAdmissionYear(pending.getAdmissionYear());
        }

        if (pending.getRole() == Role.RECRUITER) {
            user.setCompanyName(pending.getCompanyName());
            user.setDesignation(pending.getDesignation());
        }

        // This is the first point at which a User is saved.
        userRepository.save(user);

        pendingRepository.deleteByEmail(normalizedEmail);

        return "Registration successful. You can now log in.";
    }

    // Normal login after registration.
    public String login(LoginRequest request) {

        String email = request.getEmail().trim().toLowerCase();

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null || !passwordEncoder.matches(
                request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        if (!user.isActive()) {
            throw new RuntimeException("Your account is deactivated. Please contact the administrator.");
        }
        if (!user.isEmailVerified()) {
            throw new RuntimeException(
                    "Please verify your email before logging in");
        }

        return jwtService.generateToken(
                user.getEmail(), user.getRole().name());
    }

    public String forgotPassword(ForgotPasswordRequest request) {

        String email = request.getEmail().trim().toLowerCase();

        var user = userRepository.findByEmail(email);

        // Do not send OTP to an unregistered email.
        // Return a generic response to avoid revealing account existence.
        if (user.isEmpty()) {
            return "If the account exists, a password reset OTP will be sent.";
        }

        emailOtpService.sendOtp(email);

        return "If the account exists, a password reset OTP will be sent.";
    }

    @Transactional
    public String resetPassword(ResetPasswordRequest request) {

        String email = request.getEmail().trim().toLowerCase();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Invalid or expired OTP"));

        // Reuse the existing OTP verification logic.
        // It should reject expired, used, or over-attempt OTPs.
        emailOtpService.verifyOtp(email, request.getOtp());

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return "Password reset successfully. Please log in again.";
    }
}
