package com.mengyunzhi.springBootStudy.controller;

import com.mengyunzhi.springBootStudy.entity.Klass;
import com.mengyunzhi.springBootStudy.entity.School;
import com.mengyunzhi.springBootStudy.service.SchoolService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 学校控制器
 */
@RestController
@RequestMapping("School")
public class SchoolController {
    private static final Logger logger = LoggerFactory.getLogger(SchoolController.class);

    @Autowired
    SchoolService schoolService;

    @GetMapping("/list")
    public List<School> getAll() {
        return this.schoolService.getAll();
    }

    @GetMapping
    @CrossOrigin("*")
    public Page<School> findAll(
            @RequestParam String name,
            @RequestParam int page,
            @RequestParam int size) {
        return this.schoolService.findAll(
                name,
                PageRequest.of(page, size));
    }

    @PostMapping
    @CrossOrigin("*")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<Map<String, Object>> save(@RequestBody School school) {
        // 进行令牌认证与分发
        return schoolService.save(school);
    }

    /**
     * 通过ID查询学校
     * @param id 学校ID
     * @return 学校
     */
    @GetMapping("{id}")
    @CrossOrigin("*")
    public School getById(@PathVariable Long id) {
        return this.schoolService.findById(id);
    }

    @PutMapping("{id}")
    @CrossOrigin("*")
    public ResponseEntity<Map<String, Object>> update(@PathVariable Long id, @RequestBody School school) {
        return this.schoolService.update(id, school);
    }

    @DeleteMapping("{id}")
    @CrossOrigin("*")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseEntity<Map<String, Object>> deleteById(@PathVariable Long id) {
        return this.schoolService.deleteById(id);
    }
}
