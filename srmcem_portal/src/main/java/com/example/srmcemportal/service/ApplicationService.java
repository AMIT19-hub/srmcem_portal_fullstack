package com.example.srmcemportal.service;

import com.example.srmcemportal.entity.*;
import com.example.srmcemportal.repository.ApplicationRepository;
import com.example.srmcemportal.repository.JobRepository;
import com.example.srmcemportal.repository.UserRepository;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ApplicationService {
    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final StudentService studentService;
    private final FileStorageService fileStorageService;

    public ApplicationService(ApplicationRepository applicationRepository,
                              UserRepository userRepository, JobRepository jobRepository,
                              StudentService studentService,
                              FileStorageService fileStorageService) {
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.studentService = studentService;
        this.fileStorageService = fileStorageService;
    }

    public Application applyForJob(Long jobId, String email) {

        User student = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        if (student.getRole() != Role.STUDENT) {
            throw new RuntimeException("Only students can apply for jobs");
        }

        // Check whether the student has completed their profile
        studentService.validateProfileCompletion(student);

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        // 2. Check whether the job is open
        if (!"OPEN".equalsIgnoreCase(job.getStatus())) {
            throw new RuntimeException(
                    "This job is closed and no longer accepts applications");
        }

        if (job.getLastDate().isBefore(LocalDate.now())) {
            throw new RuntimeException("Application deadline has passed");
        }

        if (applicationRepository.existsByStudentAndJob(student, job)) {
            throw new RuntimeException("You have already applied for this job");
        }

        Application application = new Application();
        application.setStudent(student);
        application.setJob(job);
        application.setAppliedAt(LocalDateTime.now());
        application.setStatus(ApplicationStatus.APPLIED);

        return applicationRepository.save(application);
    }

    public List<Application> getMyApplications(String email) {

        User student = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("student not found"));

        if (student.getRole() != Role.STUDENT) {
            throw new RuntimeException("Only students can view their applications");
        }
        return applicationRepository.findByStudent(student);
    }

    public List<Application> getApplicantsForJob(Long jobId, String email) {
        User recruiter = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("recruiter not found"));

        if (recruiter.getRole() != Role.RECRUITER) {
            throw new RuntimeException("Only recruiters can view applicants");
        }
        Job job = jobRepository.findById(jobId).orElseThrow(() -> new RuntimeException("job not found"));

        if (!job.getRecruiter().getId().equals(recruiter.getId())) {
            throw new RuntimeException("joc can only see applicants for your own jobs");
        }
        return applicationRepository.findByJob(job);
    }

    @Transactional
    public Application updateStatus(Long applicationId, ApplicationStatus status, String email) {
        User recruiter = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("recruiter not found"));
        if (recruiter.getRole() != Role.RECRUITER) {
            throw new RuntimeException("Only recruiters can update application status");
        }
        Application application = applicationRepository.findByIdForUpdate(applicationId)
                .orElseThrow(() -> new RuntimeException("application not found"));
        Job job = application.getJob();
        if (!job.getRecruiter().getId().equals(recruiter.getId())) {
            throw new RuntimeException("You can update applications only for your own jobs");
        }
        application.setStatus(status);
        return application;
    }
    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }

    @Transactional
    public void withdrawApplication(Long applicationId, String email) {
        User student = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found"));
        if (student.getRole() != Role.STUDENT) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only students can withdraw applications");
        }
        Application application = applicationRepository.findByIdForUpdate(applicationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found"));
        if (!application.getStudent().getId().equals(student.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can withdraw only your application");
        }
        if (application.getStatus() != ApplicationStatus.APPLIED) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Only applications with APPLIED status can be withdrawn");
        }
        applicationRepository.delete(application);
    }
    public List<Application> getMyJobApplications(String email) {

        User recruiter = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Recruiter not found"));

        if (recruiter.getRole() != Role.RECRUITER) {
            throw new RuntimeException("Only recruiters can view their job applications");
        }
        List<Job> jobs = jobRepository.findByRecruiter(recruiter);

        List<Application> applications = new ArrayList<>();

        for (Job job : jobs) {
            applications.addAll(
                    applicationRepository.findByJob(job)
            );
        }

        return applications;
    }

    public Resource downloadApplicantResume(Long applicationId, String email)
            throws IOException {

        User recruiter = userRepository.findByEmail(email)
                .filter(user -> user.getRole() == Role.RECRUITER)
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!application.getJob().getRecruiter().getId()
                .equals(recruiter.getId())) {
            throw new RuntimeException(
                    "You can access resumes only for your own job applicants");
        }

        String resumePath = application.getStudent().getResumePath();

        return fileStorageService.loadResume(resumePath);
    }
}
