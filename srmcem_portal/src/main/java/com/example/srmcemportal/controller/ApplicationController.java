package com.example.srmcemportal.controller;

import com.example.srmcemportal.entity.Application;
import com.example.srmcemportal.entity.ApplicationStatus;
import com.example.srmcemportal.service.ApplicationService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping("/{jobId}")
    public Application applyForJob(@PathVariable Long jobId, Authentication authentication){

        String email=authentication.getName();
        return applicationService.applyForJob(jobId,email);
    }

    @GetMapping("/my")
    public List<Application> getMyApplications(Authentication authentication){
        String email=authentication.getName();
        return applicationService.getMyApplications(email);
    }

    @GetMapping("/job/{jobId}")
    public List<Application> getApplicantsForJob(@PathVariable Long jobId,Authentication authentication){
        String email= authentication.getName();
        return applicationService.getApplicantsForJob(jobId,email);
    }

    @PutMapping("/{applicationId}/status")
    public Application updateStatus(
            @PathVariable Long applicationId,
            @RequestParam ApplicationStatus status,
            Authentication authentication) {

        String email = authentication.getName();

        return applicationService.updateStatus(
                applicationId,
                status,
                email
        );
    }

    @DeleteMapping("/{applicationId}")
    public String withdrawApplication(
            @PathVariable Long applicationId,
            Authentication authentication) {

        String email = authentication.getName();

        applicationService.withdrawApplication(
                applicationId, email);

        return "Application withdrawn successfully";
    }

    @GetMapping("/recruiter/my")
    public List<Application> getMyJobApplications(
            Authentication authentication) {

        String email = authentication.getName();

        return applicationService.getMyJobApplications(email);
    }
    @GetMapping("/{applicationId}/resume")
    public ResponseEntity<Resource> downloadApplicantResume(
            @PathVariable Long applicationId,
            Authentication authentication) throws IOException {

        Resource resume = applicationService.downloadApplicantResume(
                applicationId, authentication.getName());

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"resume.pdf\"")
                .body(resume);
    }
}
