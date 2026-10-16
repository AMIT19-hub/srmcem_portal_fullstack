package com.example.srmcemportal.controller;

import com.example.srmcemportal.dto.RecruiterProfileUpdateRequest;
import com.example.srmcemportal.entity.User;
import com.example.srmcemportal.repository.UserRepository;
import com.example.srmcemportal.service.RecruiterService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/recruiter")
public class RecruiterController {

    private final RecruiterService recruiterService;

    public RecruiterController(RecruiterService recruiterService) {
        this.recruiterService = recruiterService;
    }

    @GetMapping("/profile")
    public User getProfile(Authentication authentication) {

        String email = authentication.getName();

        return recruiterService.getProfile(email);
    }

    @PutMapping("/profile")
    public User updateProfile(
            Authentication authentication,
            @Valid @RequestBody RecruiterProfileUpdateRequest request) {

        return recruiterService.updateProfile(
                authentication.getName(), request);
    }

    @PostMapping("/upload-profile-image")
    public ResponseEntity<?> uploadProfileImage(
            Authentication authentication,
            @RequestParam("file") MultipartFile file) {

        try {
            return ResponseEntity.ok(
                    recruiterService.uploadProfileImage(
                            authentication.getName(), file));
        } catch (IOException | RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}