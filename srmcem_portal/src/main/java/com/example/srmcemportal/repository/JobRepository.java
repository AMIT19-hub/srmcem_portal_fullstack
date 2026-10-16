package com.example.srmcemportal.repository;

import com.example.srmcemportal.entity.Job;
import com.example.srmcemportal.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job,Long> {

    List<Job> findByRecruiter(User recruiter);

    List<Job> findByStatus(String status);

}
