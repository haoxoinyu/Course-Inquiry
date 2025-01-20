package com.mengyunzhi.springBootStudy.controller;

import com.mengyunzhi.springBootStudy.entity.Klass;
import com.mengyunzhi.springBootStudy.entity.Term;
import com.mengyunzhi.springBootStudy.service.TermService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

/**
 * 班级控制器
 */
@RestController
@RequestMapping("Term")
public class TermController {
    private static final Logger logger = LoggerFactory.getLogger(TermController.class);

    @Autowired
    TermService termService;

    @DeleteMapping("{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        termService.deleteById(id);
    }

    @GetMapping("{id}")
    @ResponseStatus(HttpStatus.OK)
    public Term get(@PathVariable Long id) {
        return this.termService.getById(id);
    }

    @GetMapping("/getTermsBySchoolId")
    @CrossOrigin("*")
    public Page<Term> getTermsBySchoolId(@RequestParam Long schoolId) {
        return this.termService.findAll(
                "",
                schoolId,
                PageRequest.of(0, 10000000));
    }

    @GetMapping
    @CrossOrigin("*")
    public Page<Term> findAll(
            @RequestParam String name,
            @RequestParam Long schoolId,
            @RequestParam int page,
            @RequestParam int size) {
        System.out.println("Requesting page: " + page + " with size: " + size);
        return this.termService.findAll(
                name,
                schoolId,
                PageRequest.of(page, size));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void save(@RequestBody Term term) {
        this.termService.save(term);
    }

    /**
     * 更新班级
     *
     * @param id    要更新的班级ID
     * @param term
     */
    @PutMapping("{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void update(@PathVariable Long id, @RequestBody Term term) {
        this.termService.update(id, term);
    }
}
