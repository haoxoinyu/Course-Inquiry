package com.mengyunzhi.springBootStudy.controller;


import com.mengyunzhi.springBootStudy.entity.Course;
import com.mengyunzhi.springBootStudy.service.CourseService;
import com.mengyunzhi.springBootStudy.service.CourseUserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Map;

/**
 * 我的课程控制器
 */
@RestController
@RequestMapping("MyCourse")
public class MyCourseController {
    private static final Logger logger = LoggerFactory.getLogger(MyCourseController.class);

    @Autowired
    CourseService courseService;

    @Autowired
    CourseUserService courseUserService;

    @GetMapping
    @CrossOrigin("*")
    public Page<Course> findAll(
            @RequestParam String courseName,
            @RequestParam Long userId,
            @RequestParam Long sory,
            @RequestParam Long termId,
            @RequestParam int page,
            @RequestParam int size) {
        return this.courseService.findCoursesByCriteria(
                termId,
                courseName,
                sory,
                userId,
                PageRequest.of(page, size));
    }

    @GetMapping("/getCoursesByTermId")
    @CrossOrigin("*")
    public ArrayList<Course> getCoursesByTermId(
            @RequestParam Long sory,
            @RequestParam Long termId
    ) {
        System.out.println(sory);
        System.out.println(termId);

        return this.courseService.getCoursesByTermId(
            termId,
            sory);
    }

    @PostMapping
    @CrossOrigin("*")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<Map<String, Object>> addCourseToUser(@RequestBody CourseUserRequest request) {
        return courseUserService.addCourseUser(request);
    }

    @DeleteMapping
    @CrossOrigin("*")
    public ResponseEntity<Void> deleteCourseUser(@RequestParam Long courseId, @RequestParam Long userId) {
        courseUserService.deleteCourseUser(courseId, userId);
        return ResponseEntity.noContent().build();
    }
}


