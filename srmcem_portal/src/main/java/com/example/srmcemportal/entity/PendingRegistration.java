
package com.example.srmcemportal.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "pending_registrations")
@Getter
@Setter
public class PendingRegistration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, length = 100)
    private String name;

    // This stores the encoded password, not the original password.
    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    // Student fields
    private String course;
    private String rollNo;
    private Integer admissionYear;

    // Recruiter fields
    private String companyName;
    private String designation;

    @Column(nullable = false)
    private LocalDateTime expiresAt;
}
