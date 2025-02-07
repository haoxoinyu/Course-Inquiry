package com.mengyunzhi.springBootStudy.service;

import com.mengyunzhi.springBootStudy.controller.CourseUserRequest;
import com.mengyunzhi.springBootStudy.entity.Course;
import com.mengyunzhi.springBootStudy.entity.CourseUsers;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

public interface CourseUserService {

    boolean deleteCourseUser(Long courseId, Long userId);

    ResponseEntity<Map<String, Object>> addCourseUser(CourseUserRequest request);

    List<CourseUsers> findByUserId(Long userId);

    List<CourseUsers> findByCourseId(Long courseId);

    boolean validateCourseTimeConflict(Long userId, Course newCourse);

    String add(Long CourseId, Long UserId);
}