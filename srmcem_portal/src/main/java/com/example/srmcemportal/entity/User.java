package com.example.srmcemportal.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // common fields
    @Column(nullable = false, length = 100)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @JsonIgnore
    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    // student related fields
    private Integer admissionYear;
    @Column(length = 100)
    private String course;

    @Column(length = 20)
    private String rollNo;

    @Column(length = 100)
    private String skills;
    private String resumePath;

    // share fields bw student and recruiter
    private String mobileNumber;
    private String profileImagePath;


    // recruiter related fields

    @Column(length = 100)
    private String companyName;
    @Column(length = 100)
    private String designation;

    // email verification
    @Column(nullable = false)
    private boolean emailVerified = false;

    // account management
    @Column(nullable = false)
    private boolean active;

    public User() {

    }

    public User(String name, String email, String password, Role role) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.emailVerified = false;
        this.active = true;
    }
}
