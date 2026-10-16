package com.example.srmcemportal.service;



import com.example.srmcemportal.dto.ProfileCompletionResponse;
import com.example.srmcemportal.dto.StudentProfileUpdateRequest;
import com.example.srmcemportal.entity.Role;
import com.example.srmcemportal.entity.User;
import com.example.srmcemportal.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class StudentService {

    private final UserRepository userRepository;
private final FileStorageService fileStorageService;
    public StudentService(UserRepository userRepository,FileStorageService fileStorageService) {
        this.userRepository = userRepository;
        this.fileStorageService=fileStorageService;
    }

    public User getProfile(String email) {
        return userRepository.findByEmail(email)
                .filter(user -> user.getRole().name().equals("STUDENT"))
                .orElseThrow(() ->
                        new RuntimeException("Student not found"));
    }
    @Transactional
    public User updateProfile(
            String email,
            StudentProfileUpdateRequest request) {

        User student = userRepository.findByEmail(email)
                .filter(user -> user.getRole().name().equals("STUDENT"))
                .orElseThrow(() ->
                        new RuntimeException("Student not found"));

        student.setName(request.getName().trim());
        student.setMobileNumber(request.getMobileNumber());
        student.setSkills(request.getSkills());

        return userRepository.save(student);
    }



    public User uploadResume(String email, MultipartFile file)
            throws IOException {

        User student = getProfile(email);
        String oldPath = student.getResumePath();

        String newPath = fileStorageService.saveResume(file);

        try {
            student.setResumePath(newPath);
            userRepository.save(student);
        } catch (RuntimeException e) {
            fileStorageService.deleteFile(newPath);
            throw e;
        }

        if (oldPath != null && !oldPath.equals(newPath)) {
            fileStorageService.deleteFile(oldPath);
        }

        return student;
    }

    public User uploadProfileImage(String email, MultipartFile file)
            throws IOException {

        User student = getProfile(email);
        String oldPath = student.getProfileImagePath();

        String newPath = fileStorageService.saveProfileImage(file);

        try {
            student.setProfileImagePath(newPath);
            userRepository.save(student);
        } catch (RuntimeException e) {
            fileStorageService.deleteFile(newPath);
            throw e;
        }

        if (oldPath != null && !oldPath.equals(newPath)) {
            fileStorageService.deleteFile(oldPath);
        }

        return student;
    }

    public ProfileCompletionResponse getProfileCompletion(String email) {

        User student = userRepository.findByEmail(email)
                .filter(user -> user.getRole() == Role.STUDENT)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        List<String> missing = getMissingFields(student);
        int total = 8;
        int completed = total - missing.size();

        return new ProfileCompletionResponse(
                completed * 100 / total,
                completed,
                total,
                missing,
                missing.isEmpty()
        );
    }

    public void validateProfileCompletion(User student) {
        List<String> missing = getMissingFields(student);

        if (!missing.isEmpty()) {
            throw new RuntimeException(
                    "Please complete your profile. Missing fields: "
                            + String.join(", ", missing)
            );
        }
    }

    private List<String> getMissingFields(User student) {
        List<String> missing = new ArrayList<>();

        addIfMissing(student.getName(), "Name", missing);
        addIfMissing(student.isEmailVerified(), "Verified college email", missing);
        addIfMissing(student.getCourse(), "Course", missing);
        addIfMissing(student.getRollNo(), "Roll number", missing);
        addIfMissing(student.getAdmissionYear() != null, "Admission year", missing);
        addIfMissing(student.getMobileNumber(), "Mobile number", missing);
        addIfMissing(student.getSkills(), "Skills", missing);
        addIfMissing(student.getResumePath(), "Resume", missing);

        return missing;
    }

    private void addIfMissing(String value, String field, List<String> missing) {
        if (value == null || value.isBlank()) {
            missing.add(field);
        }
    }

    private void addIfMissing(boolean completed, String field, List<String> missing) {
        if (!completed) {
            missing.add(field);
        }
    }
}



