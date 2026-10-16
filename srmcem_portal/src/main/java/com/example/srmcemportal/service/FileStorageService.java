package com.example.srmcemportal.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import javax.imageio.ImageIO;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {
    private final Path uploadDirectory;

    public FileStorageService(@Value("${app.upload.dir}") String uploadDir) {
        this.uploadDirectory = Paths.get(uploadDir).toAbsolutePath().normalize();
    }

    public String saveResume(MultipartFile file) throws IOException {
        validateFile(file, 5);
        String contentType = file.getContentType();
        if (contentType == null || !contentType.equalsIgnoreCase("application/pdf")) {
            throw new RuntimeException("Only PDF resumes are allowed");
        }
        return saveFile(file, "resumes", ".pdf");
    }

    public String saveProfileImage(MultipartFile file) throws IOException {
        validateFile(file, 2);
        String contentType = file.getContentType();
        byte[] contents = file.getBytes();
        boolean isPng = contents.length >= 8
                && (contents[0] & 0xff) == 0x89
                && contents[1] == 0x50 && contents[2] == 0x4e
                && contents[3] == 0x47 && contents[4] == 0x0d
                && contents[5] == 0x0a && contents[6] == 0x1a
                && contents[7] == 0x0a;
        boolean isJpeg = contents.length >= 3
                && (contents[0] & 0xff) == 0xff
                && (contents[1] & 0xff) == 0xd8
                && (contents[2] & 0xff) == 0xff;
        boolean declaredPng = "image/png".equalsIgnoreCase(contentType);
        boolean declaredJpeg = "image/jpeg".equalsIgnoreCase(contentType);
        if ((!isPng && !isJpeg) || (isPng && !declaredPng) || (isJpeg && !declaredJpeg)) {
            throw new RuntimeException("Only valid JPG and PNG images are allowed");
        }
        if (ImageIO.read(new ByteArrayInputStream(contents)) == null) {
            throw new RuntimeException("The uploaded profile image is invalid");
        }
        return saveFile(file, "profiles", isPng ? ".png" : ".jpg");
    }

    private void validateFile(MultipartFile file, int maxSizeMb) {
        if (file == null || file.isEmpty()) throw new RuntimeException("Please select a file");
        if (file.getSize() > maxSizeMb * 1024L * 1024L) {
            throw new RuntimeException("File size must not exceed " + maxSizeMb + " MB");
        }
    }

    private String saveFile(MultipartFile file, String folder, String extension) throws IOException {
        Path directory = uploadDirectory.resolve(folder).normalize();
        Files.createDirectories(directory);
        String fileName = UUID.randomUUID() + extension;
        Path destination = directory.resolve(fileName).normalize();
        if (!destination.startsWith(directory)) throw new IOException("Invalid file path");
        try (var inputStream = file.getInputStream()) {
            Files.copy(inputStream, destination);
        }
        return folder + "/" + fileName;
    }

    public void deleteFile(String relativePath) throws IOException {
        if (relativePath == null || relativePath.isBlank()) return;
        Path filePath = uploadDirectory.resolve(relativePath).normalize();
        if (!filePath.startsWith(uploadDirectory)) throw new IOException("Invalid file path");
        Files.deleteIfExists(filePath);
    }

    public Resource loadProfileImage(String relativePath) throws IOException {
        if (relativePath == null || relativePath.isBlank()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile image not found");
        }
        Path profilesDirectory = uploadDirectory.resolve("profiles").normalize();
        Path filePath = uploadDirectory.resolve(relativePath).normalize();
        String normalizedRelativePath = relativePath.replace('\\', '/');
        if (!filePath.startsWith(profilesDirectory) || !normalizedRelativePath.startsWith("profiles/")) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile image not found");
        }
        Resource resource = new UrlResource(filePath.toUri());
        if (!resource.exists() || !resource.isReadable()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile image not found");
        }
        return resource;
    }

    public Resource loadResume(String relativePath) throws IOException {
        if (relativePath == null || relativePath.isBlank()) throw new RuntimeException("Resume not found");
        Path filePath = uploadDirectory.resolve(relativePath).normalize();
        if (!filePath.startsWith(uploadDirectory) || !relativePath.startsWith("resumes/")) {
            throw new RuntimeException("Invalid resume path");
        }
        Resource resource = new UrlResource(filePath.toUri());
        if (!resource.exists() || !resource.isReadable()) throw new RuntimeException("Resume file not found");
        return resource;
    }
}