package com.mengyunzhi.springBootStudy.service;

import com.mengyunzhi.springBootStudy.entity.*;
import com.mengyunzhi.springBootStudy.repository.CourseRepository;
import com.mengyunzhi.springBootStudy.repository.CourseUserRepository;
import com.mengyunzhi.springBootStudy.repository.KlassRepository;
import com.mengyunzhi.springBootStudy.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.function.Predicate;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
@Service
public class CourseServiceImpl implements CourseService {
    private CourseRepository courseRepository;
    private UserRepository userRepository;
    private KlassRepository klassRepository;
    private CourseUserRepository courseUserRepository;
    @Autowired
    public CourseService courseService;
    @Autowired
    public CourseUserService courseUserService;
    Map<String, Object> response = new HashMap<>();

    @Autowired
    public CourseServiceImpl(CourseRepository courseRepository, UserRepository userRepository, KlassRepository klassRepository, CourseUserRepository courseUserRepository) {
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
        this.klassRepository = klassRepository;
        this.courseUserRepository = courseUserRepository;
    }

    @Override
    public ResponseEntity<Map<String, Object>> save(Course course) {
        // 保存课程信息
        Course savedCourse = courseRepository.save(course);

        // 检查是否成功保存课程
        if (savedCourse != null) {
            // 获取课程中的用户列表
            List<User> users = course.getUsers();
            Long saveCourseId = savedCourse.getId();
            if (users != null && !users.isEmpty()) {
                // 遍历用户列表，为每个用户与课程建立关联
                for (User user : users) {
                    String data = this.courseUserService.add(saveCourseId, user.getId());
                    if (data == "与已有课程时间冲突") {
                        this.courseService.deleteById(saveCourseId);
                        response.put("error", false);
                        response.put("message", "与已有课程时间冲突");
                        return ResponseEntity.ok(response);
                    }

                }
            }

            response.put("success", true);
            response.put("message", "新增成功");
            response.put("courseId", savedCourse.getId());
        } else {
            response.put("success", false);
            response.put("message", "新增失败");
        }

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Override
    public boolean existsByName(String name) {
        return this.courseRepository.existsByName(name);
    }

    @Override
    public void deleteById(Long id) {
        this.courseRepository.deleteById(id);
    }

    @Override
    public List<Course> getAll(String name) {
        return this.courseRepository.findAllByNameContains(name);
    }


    /**
     * 获取某个班级
     *
     * @param id 班级ID
     * @return 班级
     */
    @Override
    public Course getById(Long id) {
        return this.courseRepository.findById(id).get();
    }

    /**
     * 更新班级
     * 获取数据库中的老数据
     * 使用传入的新数据对老数据的更新字段赋值
     * 将更新后的老数据重新保存在数据表中
     *
     * @param id    要更新的班级ID
     * @param course 新班级数据
     */
    @Override
    public ResponseEntity<Map<String, Object>> update(Long id, Course course) {
        // 初始化响应对象
        Map<String, Object> response = new HashMap<>();

        // 检查课程是否存在
        Optional<Course> existingCourseOptional = courseRepository.findById(id);
        if (!existingCourseOptional.isPresent()) {
            response.put("status", "error");
            response.put("message", "课程不存在");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        // 获取已存在的课程对象
        Course existingCourse = existingCourseOptional.get();

        // 更新课程属性
        existingCourse.setName(course.getName());
        existingCourse.setSory(course.getSory());
        existingCourse.setDay(course.getDay());
        existingCourse.setWeek(course.getWeek());
        existingCourse.setPeriod(course.getPeriod());
        existingCourse.setTerm(course.getTerm());

        // 更新用户列表
        List<User> updatedUsers = course.getUsers();
        if (updatedUsers != null) {
            for (User user : updatedUsers) {
                String data = this.courseUserService.add(id, user.getId());
                if ("与已有课程时间冲突".equals(data)) { // 使用字符串比较方法
                    response.put("status", "error");
                    response.put("message", "与已有课程时间冲突");
                    return ResponseEntity.ok(response);
                }
            }
        }

        // 保存更新后的课程信息
        Course updatedCourse = courseRepository.save(existingCourse);

        // 检查是否成功更新课程
        if (updatedCourse != null) {
            response.put("status", "success");
            response.put("message", "更新成功");
            response.put("courseId", updatedCourse.getId());
        } else {
            response.put("status", "error");
            response.put("message", "更新失败");
        }

        return ResponseEntity.ok(response);
    }

    @Override
    public Page<Course> findAll(String name, Long schoolId, Long klassId, Long termId, Long userId, Pageable pageable) {
        System.out.println("service" + termId);
        Klass klass = new Klass();
        klass.setId(klassId);
        System.out.println("service klassId: "+ klass.getId());
        School school = new School();
        school.setId(schoolId);
        Term term = new Term();
        term.setId(termId);
        User user = new User();
        user.setId(userId);
        return this.courseRepository.findAll(name, school, klass, term, user, pageable);
    }

    @Override
    public List<Course> findAll(Long schoolId, Long klassId, Long termId, List<Integer> week) {
        School school = new School();
        school.setId(schoolId);
        Klass klass = new Klass();
        klass.setId(klassId);
        Term term = new Term();
        term.setId(termId);
        return courseRepository.findAll(school, klass, term, week);
    }


    @Override
    public Page<Course> findCoursesByCriteria(Long termId, String courseName, Long sory, Long userId, Pageable pageable) {
        Term term = new Term();
        term.setId(termId);

        User user = new User();
        user.setId(userId);
        return courseRepository.find(term, courseName, sory, user, pageable);
    }

    @Override
    public ArrayList<Course> getCoursesByTermId(Long termId, Long sory) {
        return new ArrayList<>(courseRepository.getCoursesByTermId(termId, sory));
    }

    @Override
    public ArrayList<Course> findByTermId(Long termId) {
        return new ArrayList<>(courseRepository.findByTermId(termId));
    }

    @Override
    public Optional<Course> findById(Long courseId) {
        return this.courseRepository.findById(courseId);
    }

    public boolean checkTheSameCourse(Course course) {
        List<Course> allCourse =  this.courseRepository.findByUsers(course.getUsers());
        List<Course> selectCourse =  java.util.stream.StreamSupport.stream(allCourse.spliterator(), false)
                .collect(Collectors.toList()).stream()
                .filter(matchingCourse ->!Collections.disjoint(matchingCourse.getDay(), course.getDay()) &&
                                        !Collections.disjoint(matchingCourse.getWeek(), course.getWeek()) &&
                                        !Collections.disjoint(matchingCourse.getPeriod(), course.getPeriod()))
                .collect(Collectors.toList());
        return selectCourse.isEmpty();
    }
}
