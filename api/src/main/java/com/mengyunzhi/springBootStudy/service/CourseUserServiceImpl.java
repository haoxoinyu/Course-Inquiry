package com.mengyunzhi.springBootStudy.service;

import com.mengyunzhi.springBootStudy.controller.CourseUserRequest;
import com.mengyunzhi.springBootStudy.entity.Course;
import com.mengyunzhi.springBootStudy.entity.CourseUser;
import com.mengyunzhi.springBootStudy.entity.CourseUserId;
import com.mengyunzhi.springBootStudy.entity.User;
import com.mengyunzhi.springBootStudy.repository.CourseRepository;
import com.mengyunzhi.springBootStudy.repository.CourseUserRepository;
import com.mengyunzhi.springBootStudy.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CourseUserServiceImpl implements CourseUserService {

    @Autowired
    private CourseUserRepository courseUserRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public boolean deleteCourseUser(Long courseId, Long userId) {
        CourseUserId key = new CourseUserId(courseId, userId);

        if (courseUserRepository.existsById(key)) {
            courseUserRepository.deleteById(key);
            return true;
        } else {
            return false;
        }
    }


    @Override
    public void addCourseUser(CourseUserRequest request) {
        // 获取 course 和 user 对象
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found"));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 创建新的 CourseUser 实体并设置 Course 和 User
        CourseUser courseUser = new CourseUser();

        // 创建一个新的 CourseUserId 并设置到 courseUser 中
        CourseUserId courseUserId = new CourseUserId(request.getCourseId(), request.getUserId());
        courseUser.setId(courseUserId); // 设置复合主键

        courseUser.setCourse(course);
        courseUser.setUser(user);

        // 保存到数据库
        courseUserRepository.save(courseUser);
    }

}

