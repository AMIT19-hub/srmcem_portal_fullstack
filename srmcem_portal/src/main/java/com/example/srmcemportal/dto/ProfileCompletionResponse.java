package com.example.srmcemportal.dto;


import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ProfileCompletionResponse {

    private int completionPercentage;
    private int completedFields;
    private int totalRequiredFields;
    private List<String> missingFields;
    private boolean eligibleToApply;

    public ProfileCompletionResponse(
            int completionPercentage,
            int completedFields,
            int totalRequiredFields,
            List<String> missingFields,
            boolean eligibleToApply) {

        this.completionPercentage = completionPercentage;
        this.completedFields = completedFields;
        this.totalRequiredFields = totalRequiredFields;
        this.missingFields = missingFields;
        this.eligibleToApply = eligibleToApply;
    }

}
