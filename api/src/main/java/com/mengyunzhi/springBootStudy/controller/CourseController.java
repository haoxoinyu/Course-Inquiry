package com.mengyunzhi.springBootStudy.controller;

import com.mengyunzhi.springBootStudy.entity.Course;
import com.mengyunzhi.springBootStudy.entity.Klass;
import com.mengyunzhi.springBootStudy.entity.Term;
import com.mengyunzhi.springBootStudy.entity.User;
import com.mengyunzhi.springBootStudy.service.CourseService;
import com.mengyunzhi.springBootStudy.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("Course")
public class CourseController {
    @Autowired
    CourseService courseService;

    @Autowired
    UserService userService;

    private static final Logger logger = LoggerFactory.getLogger(CourseController.class);

    @GetMapping
    public Page<Course> findAll(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Long schoolId,
            @RequestParam(required = false) Long termId,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) Long klassId,
            @RequestParam int page,
            @RequestParam int size
    ) {
        return this.courseService.findAll(name, schoolId, klassId, termId, userId, PageRequest.of(page, size));
    }

    @GetMapping("/course-schedule")
    public List<Course> findAll(
            @RequestParam(required = false) Long schoolId,
            @RequestParam(required = false) Long termId,
            @RequestParam(required = false) Long klassId,
            @RequestParam(required = false) List<Integer> week
    ) {
        System.out.println("Received schoolId: " + schoolId);
        System.out.println("Received clazzId: " + klassId);
        System.out.println("Received termId: " + termId);
        System.out.println("Received week: " + week);
        return this.courseService.findAll(schoolId, klassId, termId, week);
    }

    @GetMapping("/findById")
    @CrossOrigin("*")
    public Course findById(@RequestParam Long courseId) {
        return this.courseService.findById(courseId).get();

    }

    @PostMapping("add")
    public ResponseEntity<Map<String, Object>> add(@RequestBody newCourse newCourse) {
        // 声明 userList 变量，使其在整个方法中可见
        List<User> userList;

        if (newCourse.getUserId() != 0) {
            // 如果 userId 不为 0，创建一个包含单个用户的列表
            User user = new User();
            user.setId(newCourse.getUserId());
            userList = new ArrayList<>();
            userList.add(user);
        } else {
            // 如果 userId 为 0，从 userService 获取用户列表
            userList = this.userService.findByKlassId(newCourse.getKlassId());
        }

        // 创建 Term 对象并设置 ID
        Term term = new Term();
        term.setId(newCourse.getTermId());

        // 创建 Course 对象并设置属性
        Course course = new Course();
        course.setName(newCourse.getName());
        course.setSory(newCourse.getSory());
        course.setDay(newCourse.getDay());
        course.setPeriod(newCourse.getPeriod());
        course.setWeek(newCourse.getWeek());
        course.setUsers(userList);  // 传递 userList 参数
        course.setTerm(term);
        return this.courseService.save(course);
    }

    @DeleteMapping("delete/{id}")
    public void onDelete(@PathVariable Long id) {
        this.courseService.deleteById(id);
    }

    @PutMapping("/updateCourse")
    public ResponseEntity<Map<String, Object>> update(@RequestBody newCourse updateCourse) {
        // 声明 userList 变量，使其在整个方法中可见
        List<User> userList;

        if (updateCourse.getUserId() != 0) {
            // 如果 userId 不为 0，创建一个包含单个用户的列表
            User user = new User();
            user.setId(updateCourse.getUserId());
            userList = new ArrayList<>();
            userList.add(user);
        } else {
            // 如果 userId 为 0，从 userService 获取用户列表
            userList = this.userService.findByKlassId(updateCourse.getKlassId());
        }

        // 创建 Term 对象并设置 ID
        Term term = new Term();
        term.setId(updateCourse.getTermId());

        // 创建 Course 对象并设置属性
        Course course = new Course();
        course.setId(updateCourse.getId()); // 设置课程 ID
        course.setName(updateCourse.getName());
        course.setSory(updateCourse.getSory());
        course.setDay(updateCourse.getDay());
        course.setPeriod(updateCourse.getPeriod());
        course.setWeek(updateCourse.getWeek());
        course.setUsers(userList);  // 传递 userList 参数
        course.setTerm(term);

        return this.courseService.update(updateCourse.getId(), course);
    }

    @PutMapping("addElectiveCourses")
    public void addElectiveCourses(@RequestBody CourseUserRequest courseUserRequest) {
        Optional<Course> electiveCourse = this.courseService.findById(courseUserRequest.getCourseId());
        User user = new User();
        user.setId(courseUserRequest.getUserId());
        List<User> userList = new ArrayList<>();
        userList.add(user);
        electiveCourse.get().setUsers(userList);
        this.courseService.save(electiveCourse.get());
    }
}
class newCourse{
    private Long id;
    private String name ;
    private Long sory;
    private List<Integer> week;
    private List<Integer> day;
    private List<Integer> period;
    private Long schoolId;
    private Long klassId;
    private Long termId;
    private Long userId;

    public Long getId() {
        return id;
    }

    public List<Integer> getDay() {
        return day;
    }

    public List<Integer> getPeriod() {
        return period;
    }

    public List<Integer> getWeek() {
        return week;
    }

    public Long getKlassId() {
        return klassId;
    }

    public Long getSchoolId() {
        return schoolId;
    }

    public Long getSory() {
        return sory;
    }

    public Long getTermId() {
        return termId;
    }

    public Long getUserId() {
        return userId;
    }

    public String getName() {
        return name;
    }
}
