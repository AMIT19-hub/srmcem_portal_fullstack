package com.example.srmcemportal.dto;

import com.example.srmcemportal.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class RegisterRequest {
    //common fields
    @NotBlank(message = "Name is required")
    @Size(max = 100,message = "Name can not exceed 100 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Enter a valid email address")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8,max = 72,message = "Password must be between 8 and 72 characters")
    private String password;

    @NotNull(message = "Role is required")
    private Role role;


    // student fields
    private String course;
    private String rollNo;

    // recruiter fields

    private String companyName;
    private String designation;

}
