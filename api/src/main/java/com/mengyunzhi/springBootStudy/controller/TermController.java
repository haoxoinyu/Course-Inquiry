package com.mengyunzhi.springBootStudy.controller;

import com.mengyunzhi.springBootStudy.entity.Klass;
import com.mengyunzhi.springBootStudy.entity.Term;
import com.mengyunzhi.springBootStudy.service.TermService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

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
    @CrossOrigin("*")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseEntity<Map<String, Object>> delete(@PathVariable Long id) {
        return termService.deleteById(id);
    }

    @GetMapping("{id}")
    @CrossOrigin("*")
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
    @CrossOrigin("*")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<Map<String, Object>> save(@RequestBody Term term) {
        return this.termService.save(term);
    }

    /**
     * 更新班级
     *
     * @param id    要更新的班级ID
     * @param term
     */
    @PutMapping("{id}")
    @CrossOrigin("*")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseEntity<Map<String, Object>> update(@PathVariable Long id, @RequestBody Term term) {
        return this.termService.update(id, term);
    }

    @GetMapping("/getCurrentTerm")
    @CrossOrigin("*")
    public ResponseEntity<?> getCurrentTerm(@RequestParam Long schoolId,
                                            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date date) {
        System.out.println("Received schoolId: " + schoolId);
        System.out.println("Received date: " + date);
        Optional<Term> term = termService.getCurrentTermBySchool(schoolId, date);

        if (term.isPresent()) {
            return ResponseEntity.ok(term.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("当前日期不在任何学期的日期范围内");
        }
    }

    @GetMapping("/getCoursesByTerm/{termId}")
    @CrossOrigin("*")
    public boolean getCoursesByTerm(@PathVariable Long termId) {
        return this.termService.getCoursesByTerm(termId);
    }

    @GetMapping("/getCurrencyWeekOfEachSchool")
    public List<Map<String, String>>  getCurrencyWeekOfEachSchool(@RequestParam String firstDayOfCurrentWeek) {
       return  this.termService.getCurrencyWeekOfEachSchool(firstDayOfCurrentWeek);
    }
}

