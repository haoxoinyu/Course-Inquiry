package com.mengyunzhi.springBootStudy.controller;

import com.mengyunzhi.springBootStudy.entity.Course;
import com.mengyunzhi.springBootStudy.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("Course")
public class CourseController {
    @Autowired
    CourseService courseService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Course save(@RequestBody Course course) {
        return this.courseService.save(course);
    }

    @GetMapping("existsByName")
    public boolean existsByName(@RequestParam String name) {
        return this.courseService.existsByName(name);
    }

    @DeleteMapping("{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        courseService.deleteById(id);
    }

    @GetMapping("{id}")
    @ResponseStatus(HttpStatus.OK)
    public Course get(@PathVariable Long id) {
        return this.courseService.getById(id);
    }

    @GetMapping
    public List<Course> getAll(@RequestParam String name) {
        return this.courseService.getAll(name);
    }

    /**
     * 更新班级
     *
     * @param id    要更新的班级ID
     * @param course 新班级数据
     */
    @PutMapping("{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void update(@PathVariable Long id, @RequestBody Course course) {
        this.courseService.update(id, course);
    }
}
