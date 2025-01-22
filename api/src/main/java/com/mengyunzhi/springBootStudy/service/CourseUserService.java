package com.mengyunzhi.springBootStudy.service;

import com.mengyunzhi.springBootStudy.controller.CourseUserRequest;
import com.mengyunzhi.springBootStudy.entity.CourseUser;
import com.mengyunzhi.springBootStudy.entity.School;
import com.mengyunzhi.springBootStudy.entity.User;

import java.util.List;

public interface CourseUserService {

    boolean deleteCourseUser(Long courseId, Long userId);

    void addCourseUser(CourseUserRequest request);

    List<CourseUser> findByUserId(Long userId);
}