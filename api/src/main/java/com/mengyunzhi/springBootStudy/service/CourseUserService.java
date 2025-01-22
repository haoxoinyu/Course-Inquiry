package com.mengyunzhi.springBootStudy.service;

import com.mengyunzhi.springBootStudy.controller.CourseUserRequest;
import com.mengyunzhi.springBootStudy.entity.CourseUsers;

import java.util.List;

public interface CourseUserService {

    boolean deleteCourseUser(Long courseId, Long userId);

    void addCourseUser(CourseUserRequest request);

    List<CourseUsers> findByUserId(Long userId);
}