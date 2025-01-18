package com.mengyunzhi.springBootStudy.controller;

import com.mengyunzhi.springBootStudy.entity.Course;
import com.mengyunzhi.springBootStudy.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("Course")
public class CourseController {
    @Autowired
    CourseService courseService;

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
        System.out.println("成功请求Course.findAll方法");
        return this.courseService.findAll(name, schoolId, klassId, termId, userId, PageRequest.of(page, size));
    }
}
