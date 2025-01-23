package com.mengyunzhi.springBootStudy.controller;

import com.mengyunzhi.springBootStudy.entity.Course;
import com.mengyunzhi.springBootStudy.entity.Term;
import com.mengyunzhi.springBootStudy.entity.User;
import com.mengyunzhi.springBootStudy.service.CourseService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("Course")
public class CourseController {
    @Autowired
    CourseService courseService;
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

    @PostMapping("/course-schedule")
    public List<Course> findAll(
            @RequestParam(required = false) Long schoolId,
            @RequestParam(required = false) Long termId,
            @RequestParam(required = false) Long klassId,
            @RequestParam(required = false) List<Integer> week
    ) {
        return this.courseService.findAll(schoolId, klassId, termId, week);
    }

    @GetMapping("/findById")
    @CrossOrigin("*")
    public Course findById(@RequestParam Long courseId) {
        return this.courseService.findById(courseId).get();

    }

    @PostMapping("add")
    public void add(@RequestBody newCourse newCourse) {
        User user = new User();
        user.setId(newCourse.getUserId());
        List<User> userList = new ArrayList<>();
        userList.add(user);
        Term term = new Term();
        term.setId(newCourse.getTermId());
        Course course = new Course();
        course.setName(newCourse.getName());
        course.setSory(newCourse.getSory());
        course.setDay(newCourse.getDay());
        course.setPeriod(newCourse.getPeriod());
        course.setWeek(newCourse.getWeek());
        course.setUsers(userList);
        course.setTerm(term);
        this.courseService.save(course);
    }

    @DeleteMapping("delete/{id}")
    public void onDelete(@PathVariable Long id) {
        this.courseService.deleteById(id);
    }

    @PutMapping("/updateCourse")
    public void update(@RequestBody newCourse updateCourse) {
        Course course = new Course();
        Term term = new Term();
        term.setId(updateCourse.getTermId());
        User user = new User();
        user.setId(updateCourse.getUserId());
        List<User> userList = new ArrayList<>();
        userList.add(user);
        course.setTerm(term);
        course.setId(updateCourse.getId());
        course.setPeriod(updateCourse.getPeriod());
        course.setWeek(updateCourse.getWeek());
        course.setUsers(userList);
        course.setDay(updateCourse.getDay());
        course.setSory(updateCourse.getSory());
        course.setName(updateCourse.getName());
        this.courseService.update(updateCourse.getId(), course);
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
