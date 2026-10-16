package com.example.srmcemportal.config;

import com.example.srmcemportal.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();

    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of(
                "http://localhost:3000",
                "http://localhost:5173"
        ));

        configuration.setAllowedMethods(List.of(
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "OPTIONS"
        ));

        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .cors(cors->{})
                .csrf(csrf -> csrf.disable())

                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .authorizeHttpRequests(auth ->
                        auth.requestMatchers("/auth/register",
                                        "/auth/login", "/auth/verify-otp",
                                        "/auth/forgot-password","/auth/reset-password")
                                .permitAll()
                                .requestMatchers("/student").hasRole("STUDENT")
                                .requestMatchers("/recruiter").hasRole("RECRUITER")
                                .requestMatchers("/admin/**").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.POST, "/jobs").hasRole("RECRUITER")
                                .requestMatchers(HttpMethod.GET, "/jobs").hasAnyRole("STUDENT", "RECRUITER", "ADMIN")
                                .requestMatchers(HttpMethod.GET, "/jobs/{id}").hasAnyRole("STUDENT", "RECRUITER", "ADMIN")
                                .requestMatchers(HttpMethod.PUT, "/jobs/{id}").hasRole("RECRUITER")
                                .requestMatchers(HttpMethod.DELETE, "/jobs/{id}").hasRole("RECRUITER")
                                .requestMatchers(HttpMethod.POST,"/applications/{jobId}").hasRole("STUDENT")
                                .requestMatchers(HttpMethod.GET, "/applications/my").hasRole("STUDENT")
                                .requestMatchers(HttpMethod.GET, "/applications/job/{jobId}").hasRole("RECRUITER")
                                .requestMatchers(HttpMethod.PUT, "/applications/{applicationId}/status").hasRole("RECRUITER")
                                .requestMatchers(HttpMethod.DELETE, "/applications/{applicationId}").hasRole("STUDENT")
                                .requestMatchers(HttpMethod.GET, "/profile/image").hasAnyRole("STUDENT", "RECRUITER")
                                .requestMatchers(HttpMethod.GET,"/applications/recruiter/my").hasRole("RECRUITER")
                                .requestMatchers("/student/**").hasRole("STUDENT")
                                .requestMatchers("/recruiter/**").hasRole("RECRUITER")
                                .anyRequest().authenticated())

                .addFilterBefore(jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
