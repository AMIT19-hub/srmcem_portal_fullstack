package com.example.srmcemportal.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "applications")
public class Application {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private User student;

    @ManyToOne
    @JoinColumn(name="job_id")
    private Job job;

    private LocalDateTime appliedAt;

    @Enumerated(EnumType.STRING)
    private ApplicationStatus status;

    public Application(){

    }

    public Application( User student, Job job, LocalDateTime appliedAt, ApplicationStatus status) {
        this.student = student;
        this.job = job;
        this.appliedAt = appliedAt;
        this.status = status;
    }
}
