
package com.example.srmcemportal.validation;

import java.util.Locale;

public final class CollegeEmailValidator {

    private static final String COLLEGE_DOMAIN = "@srmcm.ac.in";

    private CollegeEmailValidator() {
    }

    public static boolean isValid(String email) {
        if (email == null) {
            return false;
        }

        String normalizedEmail = email.trim().toLowerCase(Locale.ROOT);

        return normalizedEmail.matches(
                "^[a-z0-9._%+-]+@srmcm\\.ac\\.in$"
        );
    }
}
