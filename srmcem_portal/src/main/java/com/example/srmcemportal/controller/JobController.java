package com.example.srmcemportal.controller;

import com.example.srmcemportal.entity.Job;
import com.example.srmcemportal.service.JobService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/jobs")
public class JobController {
    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @PostMapping
    public Job createJob(@Valid @RequestBody Job job, Authentication authentication) {

        String email = authentication.getName();
        return jobService.createJob(job, email);
    }

    @GetMapping
    public List<Job> getAllJobs() {
        return jobService.getOpenJobs();
    }

    @GetMapping("/my")
    public List<Job> getMyJobs(Authentication authentication) {

        String email = authentication.getName();
        return jobService.getMyJobs(email);
    }

    @GetMapping("/{id}")
    public Job getJobId(@PathVariable Long id) {
        return jobService.getJobById(id);
    }

    @PutMapping("/{id}")
    public Job updateJob(Authentication authentication, @PathVariable Long id, @Valid @RequestBody Job updatedJob) {
        String email = authentication.getName();
        return jobService.updateJob(id, updatedJob, email);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteJob(
            @PathVariable Long id,
            Authentication authentication) {

        jobService.deleteJob(id, authentication.getName());

        return ResponseEntity.ok(
                Map.of("message", "Job closed successfully")
        );
    }
}
