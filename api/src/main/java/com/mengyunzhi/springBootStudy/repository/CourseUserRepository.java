package com.mengyunzhi.springBootStudy.repository;

import com.mengyunzhi.springBootStudy.entity.CourseUser;
import com.mengyunzhi.springBootStudy.entity.CourseUserId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseUserRepository extends JpaRepository<CourseUser, CourseUserId> {
}
