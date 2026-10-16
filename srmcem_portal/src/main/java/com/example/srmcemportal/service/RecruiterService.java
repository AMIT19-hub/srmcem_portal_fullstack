package com.example.srmcemportal.service;

import com.example.srmcemportal.dto.RecruiterProfileUpdateRequest;
import com.example.srmcemportal.entity.User;
import com.example.srmcemportal.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class RecruiterService {
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    public RecruiterService(UserRepository userRepository, FileStorageService fileStorageService) {
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
    }

    public User getProfile(String email) {
        return userRepository.findByEmail(email)
                .filter(user -> user.getRole().name().equals("RECRUITER"))
                .orElseThrow(() ->
                        new RuntimeException("Recruiter not found"));
    }


    @Transactional
    public User updateProfile(
            String email, RecruiterProfileUpdateRequest request) {

        User recruiter = getProfile(email);

        recruiter.setName(request.getName().trim());
        recruiter.setMobileNumber(request.getMobileNumber());
        recruiter.setCompanyName(request.getCompanyName().trim());
        recruiter.setDesignation(request.getDesignation().trim());

        return userRepository.save(recruiter);
    }

    public User uploadProfileImage(String email, MultipartFile file)
            throws IOException {

        User recruiter = getProfile(email);
        String oldPath = recruiter.getProfileImagePath();

        String newPath = fileStorageService.saveProfileImage(file);

        try {
            recruiter.setProfileImagePath(newPath);
            userRepository.save(recruiter);
        } catch (RuntimeException e) {
            fileStorageService.deleteFile(newPath);
            throw e;
        }

        if (oldPath != null && !oldPath.equals(newPath)) {
            fileStorageService.deleteFile(oldPath);
        }

        return recruiter;
    }
}
