package com.mengyunzhi.springBootStudy.repository;

import com.mengyunzhi.springBootStudy.entity.Course;
import com.mengyunzhi.springBootStudy.entity.CourseUsers;
import com.mengyunzhi.springBootStudy.entity.CourseUserId;
import com.mengyunzhi.springBootStudy.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseUserRepository extends JpaRepository<CourseUsers, CourseUserId> {
    List<CourseUsers> findByUser(User user);

    List<CourseUsers> findByCourse(Course course);

    long countByCourseId(Long courseId);
}
