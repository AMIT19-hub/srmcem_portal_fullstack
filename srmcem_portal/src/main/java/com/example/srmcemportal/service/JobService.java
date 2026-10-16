package com.example.srmcemportal.service;

import com.example.srmcemportal.entity.Job;
import com.example.srmcemportal.entity.Role;
import com.example.srmcemportal.entity.User;
import com.example.srmcemportal.repository.JobRepository;
import com.example.srmcemportal.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public JobService(JobRepository jobRepository, UserRepository userRepository) {
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
    }

    public Job createJob(Job job, String email) {


        User recruiter = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));

        if (recruiter.getRole() != Role.RECRUITER) {
            throw new RuntimeException("Only recruiters can create jobs");
        }

        job.setRecruiter(recruiter);
        return jobRepository.save(job);
    }

    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }
    public List<Job> getOpenJobs() {
        return jobRepository.findByStatus("OPEN");
    }

    public List<Job> getMyJobs(String email) {
        User recruiter = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("recruiter not found"));

        return jobRepository.findByRecruiter(recruiter);
    }

    public Job getJobById(Long id) {
        return jobRepository.findById(id).orElseThrow(() -> new RuntimeException("job not fount"));
    }

    public Job updateJob(Long id, Job updatedJob, String email) {
        Job existingJob = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("job not found"));

        User recruiter = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("recruiter not found"));

        if (recruiter.getRole() != Role.RECRUITER) {
            throw new RuntimeException("Only recruiters can manage their jobs");
        }
        if(!existingJob.getRecruiter().getId().equals(recruiter.getId())){
            throw new RuntimeException("you can update only your jobs");
        }

        // update previous values
        existingJob.setCompanyName(updatedJob.getCompanyName());
        existingJob.setJobTitle(updatedJob.getJobTitle());
        existingJob.setDescription(updatedJob.getDescription());
        existingJob.setLocation(updatedJob.getLocation());
        existingJob.setSalary(updatedJob.getSalary());
        existingJob.setEligibility(updatedJob.getEligibility());
        existingJob.setSkills(updatedJob.getSkills());
        existingJob.setLastDate(updatedJob.getLastDate());

        return jobRepository.save(existingJob);


    }
    @Transactional
    public void deleteJob(Long jobId, String email) {

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() ->
                        new RuntimeException("Job not found"));

        // Verify that this recruiter owns the job
        if (!job.getRecruiter().getEmail().equals(email)) {
            throw new RuntimeException(
                    "You are not authorized to close this job");
        }

        // Soft delete: preserve the job and its applications
        job.setStatus("CLOSED");
        jobRepository.save(job);
    }
}
