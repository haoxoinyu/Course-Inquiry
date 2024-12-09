package com.mengyunzhi.springBootStudy.controller;

import com.mengyunzhi.springBootStudy.entity.School;
import com.mengyunzhi.springBootStudy.service.SchoolService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 学校控制器
 */
@RestController
@RequestMapping("School")
public class SchoolController {
    private static final Logger logger = LoggerFactory.getLogger(SchoolController.class);

    @Autowired
    SchoolService schoolServiceImplService;

    @DeleteMapping("{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        schoolServiceImplService.deleteById(id);
    }

    @GetMapping("{id}")
    @ResponseStatus(HttpStatus.OK)
    public School get(@PathVariable Long id) {
        return this.schoolServiceImplService.getById(id);
    }

    @GetMapping
    public List<School> getAll(@RequestParam String name) {
        return this.schoolServiceImplService.getAll(name);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void save(@RequestBody School schoolServiceImpl) {
        this.schoolServiceImplService.save(schoolServiceImpl);
    }

    /**
     * 更新学校
     *
     * @param id    要更新的学校ID
     * @param schoolServiceImpl 新学校数据
     */
    @PutMapping("{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void update(@PathVariable Long id, @RequestBody School schoolServiceImpl) {
        this.schoolServiceImplService.update(id, schoolServiceImpl);
    }
}
