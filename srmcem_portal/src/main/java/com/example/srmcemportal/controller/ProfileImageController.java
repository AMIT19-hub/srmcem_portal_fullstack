package com.example.srmcemportal.controller;

import com.example.srmcemportal.entity.Role;
import com.example.srmcemportal.entity.User;
import com.example.srmcemportal.repository.UserRepository;
import com.example.srmcemportal.service.FileStorageService;
import org.springframework.core.io.Resource;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.Locale;

@RestController
@RequestMapping("/profile")
public class ProfileImageController {
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    public ProfileImageController(UserRepository userRepository, FileStorageService fileStorageService) {
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
    }

    @GetMapping("/image")
    public ResponseEntity<Resource> getMyProfileImage(Authentication authentication) throws IOException {
        User user = userRepository.findByEmail(authentication.getName())
                .filter(account -> account.getRole() == Role.STUDENT || account.getRole() == Role.RECRUITER)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile image not found"));
        String imagePath = user.getProfileImagePath();
        Resource image = fileStorageService.loadProfileImage(imagePath);
        MediaType mediaType = imagePath.toLowerCase(Locale.ROOT).endsWith(".png")
                ? MediaType.IMAGE_PNG : MediaType.IMAGE_JPEG;
        return ResponseEntity.ok()
                .contentType(mediaType)
                .cacheControl(CacheControl.noCache().cachePrivate())
                .body(image);
    }
}