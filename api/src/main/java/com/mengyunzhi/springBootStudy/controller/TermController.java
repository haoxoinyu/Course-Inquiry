package com.mengyunzhi.springBootStudy.controller;

import com.mengyunzhi.springBootStudy.entity.Term;
import com.mengyunzhi.springBootStudy.service.TermService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 学期控制器
 */
@RestController
@RequestMapping("Term")
public class TermController {
    private static final Logger logger = LoggerFactory.getLogger(TermController.class);

    @Autowired
    TermService termServiceImplService;

    @DeleteMapping("{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        termServiceImplService.deleteById(id);
    }

    @GetMapping("{id}")
    @ResponseStatus(HttpStatus.OK)
    public Term get(@PathVariable Long id) {
        return this.termServiceImplService.getById(id);
    }

    @GetMapping
    public List<Term> getAll(@RequestParam String name) {
        return this.termServiceImplService.getAll(name);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void save(@RequestBody Term termServiceImpl) {
        this.termServiceImplService.save(termServiceImpl);
    }

    /**
     * 更新学期
     *
     * @param id    要更新的学期ID
     * @param termServiceImpl 新学期数据
     */
    @PutMapping("{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void update(@PathVariable Long id, @RequestBody Term termServiceImpl) {
        this.termServiceImplService.update(id, termServiceImpl);
    }
}
