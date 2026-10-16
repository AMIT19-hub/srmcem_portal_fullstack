package com.example.srmcemportal.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StudentProfileUpdateRequest {

    @NotBlank
    @Size(max = 100)
    private String name;

    @Size(max = 20)
    private String mobileNumber;

    @Size(max = 1000)
    private String skills;
}