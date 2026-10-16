package com.example.srmcemportal.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "jobs")
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotBlank
    private String companyName;
    @NotBlank
    private String jobTitle;
    @NotBlank
    private String description;
    @NotBlank
    private String location;
    @NotBlank
    private String salary;
    @NotBlank
    private String eligibility;
    @NotBlank
    private String skills;
    @NotNull
    private LocalDate lastDate;

    @Column(nullable = false)
    private String status = "OPEN";

    @ManyToOne
    @JoinColumn(name = "recruiter_id")
    private User recruiter;

}
