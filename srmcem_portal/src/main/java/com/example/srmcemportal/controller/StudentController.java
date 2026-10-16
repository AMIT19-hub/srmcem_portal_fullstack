package com.example.srmcemportal.controller;

import com.example.srmcemportal.dto.ProfileCompletionResponse;
import com.example.srmcemportal.dto.StudentProfileUpdateRequest;
import com.example.srmcemportal.entity.User;
import com.example.srmcemportal.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/student")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping("/profile")
    public User getProfile(Authentication authentication) {
        return studentService.getProfile(authentication.getName());
    }
    @PutMapping("/profile")
    public User updateProfile(
            Authentication authentication,
            @Valid @RequestBody StudentProfileUpdateRequest request) {

        return studentService.updateProfile(
                authentication.getName(), request);
    }

    @PostMapping("/upload-resume")
    public ResponseEntity<?> uploadResume(
            Authentication authentication,
            @RequestParam("file") MultipartFile file) {

        try {
            return ResponseEntity.ok(
                    studentService.uploadResume(
                            authentication.getName(), file));
        } catch (IOException | RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/upload-profile-image")
    public ResponseEntity<?> uploadProfileImage(
            Authentication authentication,
            @RequestParam("file") MultipartFile file) {

        try {
            return ResponseEntity.ok(
                    studentService.uploadProfileImage(
                            authentication.getName(), file));
        } catch (IOException | RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/profile-completion")
    public ResponseEntity<ProfileCompletionResponse> getProfileCompletion(
            Authentication authentication) {

        ProfileCompletionResponse response =
                studentService.getProfileCompletion(authentication.getName());

        return ResponseEntity.ok(response);
    }

}