package com.mengyunzhi.springBootStudy.service;

import com.mengyunzhi.springBootStudy.controller.CourseUserRequest;
import com.mengyunzhi.springBootStudy.entity.CourseUser;

public interface CourseUserService {

    boolean deleteCourseUser(Long courseId, Long userId);

    void addCourseUser(CourseUserRequest request);
}