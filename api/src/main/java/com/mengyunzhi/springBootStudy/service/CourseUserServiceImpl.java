package com.mengyunzhi.springBootStudy.service;

import com.mengyunzhi.springBootStudy.controller.CourseUserRequest;
import com.mengyunzhi.springBootStudy.entity.*;
import com.mengyunzhi.springBootStudy.repository.CourseRepository;
import com.mengyunzhi.springBootStudy.repository.CourseUserRepository;
import com.mengyunzhi.springBootStudy.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CourseUserServiceImpl implements CourseUserService {

    @Autowired
    private CourseUserRepository courseUserRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    CourseUserService courseUserService;

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public boolean deleteCourseUser(Long courseId, Long userId) {
        CourseUserId key = new CourseUserId(courseId, userId);

        // 检查是否存在该关系
        if (courseUserRepository.existsById(key)) {
            // 删除关系
            courseUserRepository.deleteById(key);

            // 检查是否有其他用户选择了该课程
            long count = courseUserRepository.countByCourseId(courseId);

            // 如果没有其他用户选择了该课程，则删除课程
            if (count == 0) {
                courseRepository.deleteById(courseId);
            }

            return true;
        } else {
            return false;
        }
    }


    @Override
    public ResponseEntity<Map<String, Object>> addCourseUser(CourseUserRequest request) {
        // 获取 course 和 user 对象
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found"));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 创建一个新的 CourseUserId
        CourseUserId courseUserId = new CourseUserId(request.getCourseId(), request.getUserId());

        Map<String, Object> response = new HashMap<>();

        // 检查数据库中是否已经存在相同的 CourseUsers 条目
        if (courseUserRepository.existsById(courseUserId)) {
            response.put("status", "error");
            response.put("message", "该课程已存在");
            return ResponseEntity.ok(response);
        }

        // 调用时间验证服务
        boolean isTimeConflict = courseUserService.validateCourseTimeConflict(user.getId(), course);
        if (!isTimeConflict) {
            response.put("status", "error");
            response.put("message", "与已有课程时间冲突");
            return ResponseEntity.ok(response);
        }

        // 创建新的 CourseUser 实体并设置 Course 和 User
        CourseUsers courseUsers = new CourseUsers();

        courseUsers.setId(courseUserId); // 设置复合主键

        courseUsers.setCourse(course);
        courseUsers.setUser(user);

        // 保存到数据库
        courseUserRepository.save(courseUsers);

        response.put("status", "success");
        response.put("message", "新增成功");
        return ResponseEntity.ok(response);
    }

    @Override
    public String add(Long CourseId, Long UserId) {
        // 获取 course 和 user 对象
        Course course = courseRepository.findById(CourseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        User user = userRepository.findById(UserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 创建一个新的 CourseUserId
        CourseUserId courseUserId = new CourseUserId(CourseId, UserId);

        // 调用时间验证服务
        boolean isTimeConflict = courseUserService.validateCourseTimeConflict(user.getId(), course);
        if (!isTimeConflict) {
            return "与已有课程时间冲突";
        }

        // 创建新的 CourseUser 实体并设置 Course 和 User
        CourseUsers courseUsers = new CourseUsers();

        courseUsers.setId(courseUserId); // 设置复合主键

        courseUsers.setCourse(course);
        courseUsers.setUser(user);

        // 保存到数据库
        courseUserRepository.save(courseUsers);

        return "新增成功";
    }

    @Override
    public List<CourseUsers> findByUserId(Long userId) {
        User user = new User();
        user.setId(userId);
        return this.courseUserRepository.findByUser(user);
    }

    /**
     * 验证用户是否已有时间冲突的课程
     * @param userId 用户ID
     * @param newCourse 新课程对象
     * @return 如果存在时间冲突，返回false；否则返回true
     */
    @Override
    public boolean validateCourseTimeConflict(Long userId, Course newCourse) {
        // 获取新课程的时间信息
        List<Integer> newCourseDays = newCourse.getDay();        // 获取课程的天数
        List<Integer> newCoursePeriods = newCourse.getPeriod();   // 获取课程的节次
        List<Integer> newCourseWeeks = newCourse.getWeek();      // 获取课程的周次

        // 打印调试信息以确认数据
        System.out.println("Days: " + newCourseDays);
        System.out.println("Periods: " + newCoursePeriods);
        System.out.println("Weeks: " + newCourseWeeks);

        // 如果时间数据为空，则抛出异常
        if (newCourseDays.isEmpty() || newCoursePeriods.isEmpty() || newCourseWeeks.isEmpty()) {
            throw new IllegalArgumentException("Course time data cannot be empty");
        }

        // 构造原生 SQL 查询，查找与新课程时间冲突的课程
        String sql = "SELECT COUNT(*) FROM course_users cu " +
                "JOIN course_day cd ON cu.course_id = cd.course_id " +  // 连接 course_day 表
                "JOIN course_period cp ON cu.course_id = cp.course_id " +  // 连接 course_period 表
                "JOIN course_week cw ON cu.course_id = cw.course_id " +    // 连接 course_week 表
                "WHERE cu.users_id = :userId " +                          // 用户ID
                "AND cu.course_id != :newCourseId " +                     // 排除当前课程
                "AND cd.day IN (:days) " +                                // 检查课程是否在同一天
                "AND cp.period IN (:periods) " +                          // 检查课程是否在同一节次
                "AND cw.week IN (:weeks)";                                // 检查课程是否在同一周

        // 创建 Query 对象
        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("userId", userId);                    // 设置用户ID
        query.setParameter("newCourseId", newCourse.getId());    // 设置新课程ID
        query.setParameter("days", newCourseDays);               // 设置课程的天数
        query.setParameter("periods", newCoursePeriods);         // 设置课程的节次
        query.setParameter("weeks", newCourseWeeks);             // 设置课程的周次

        // 执行查询并获取结果
        long count = ((Number) query.getSingleResult()).longValue();

        // 如果存在时间冲突的课程，返回 false
        return count == 0;
    }


}


