package com.mengyunzhi.springBootStudy.controller;

import com.mengyunzhi.springBootStudy.Exception.TermAlreadyExistsException;
import com.mengyunzhi.springBootStudy.entity.Klass;
import com.mengyunzhi.springBootStudy.entity.Term;
import com.mengyunzhi.springBootStudy.service.TermService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    // 添加学期
    public ResponseEntity<String> save(@RequestBody Term term) {
        try {
            termService.save(term);  // 调用服务层方法添加学期
            return ResponseEntity.ok("学期添加成功");
        } catch (TermAlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());  // 返回学期名称已存在的错误消息
        }
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
