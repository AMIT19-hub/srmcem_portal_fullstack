package com.example.srmcemportal.repository;

import com.example.srmcemportal.entity.Application;
import com.example.srmcemportal.entity.Job;
import com.example.srmcemportal.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;
import java.util.Optional;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application,Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select application from Application application where application.id = :applicationId")
    Optional<Application> findByIdForUpdate(@Param("applicationId") Long applicationId);

    boolean existsByStudentAndJob(User student, Job job);
    List<Application> findByStudent(User user);

    List<Application> findByJob(Job job);
    void deleteByJob(Job job);

    boolean existsByIdAndJob_Recruiter_Id(Long applicationId, Long recruiterId);


}
