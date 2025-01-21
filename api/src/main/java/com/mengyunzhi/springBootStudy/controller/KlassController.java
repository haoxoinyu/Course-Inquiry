package com.mengyunzhi.springBootStudy.controller;

import com.mengyunzhi.springBootStudy.entity.Klass;
import com.mengyunzhi.springBootStudy.entity.School;
import com.mengyunzhi.springBootStudy.service.KlassService;
import com.mengyunzhi.springBootStudy.service.SchoolService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 班级控制器
 */
@RestController
@RequestMapping("Klass")
public class KlassController {
    private static final Logger logger = LoggerFactory.getLogger(KlassController.class);

    @Autowired
    KlassService klassService;

    @Autowired
    SchoolService schoolService;

    @DeleteMapping("{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        klassService.deleteById(id);
    }

    @GetMapping("{id}")
    @ResponseStatus(HttpStatus.OK)
    public Klass get(@PathVariable Long id) {
        return this.klassService.getById(id);
    }

    @GetMapping("getKlassBySchoolId/{schoolId}")
    @ResponseStatus(HttpStatus.OK)
    public List<Klass> getKlassBySchoolId(@PathVariable Long schoolId) {
        School school = new School();
        school.setId(schoolId);
        return this.klassService.getKlassBySchool(school);
    }

    @GetMapping("/list")
    public List<Klass> getAll() {
        return this.klassService.getAll();
    }

    @GetMapping
    @CrossOrigin("*")
    public Page<Klass> findAll(
            @RequestParam String name,
            @RequestParam Long schoolId,
            @RequestParam int page,
            @RequestParam int size) {
        return this.klassService.findAll(
                name,
                schoolId,
                PageRequest.of(page, size));
    }

    @GetMapping("/getKlassesBySchoolId")
    @CrossOrigin("*")
    public Page<Klass> getKlassesBySchoolId(@RequestParam Long schoolId) {
        return this.klassService.findAll(
                "",
                schoolId,
                PageRequest.of(0, 10000000));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void save(@RequestBody Klass klass) {
        this.klassService.save(klass);
    }

    /**
     * 更新班级
     *
     * @param id    要更新的班级ID
     * @param klass 新班级数据
     */
    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void update(@PathVariable Long id, @RequestBody Klass klass) {
        this.klassService.update(id, klass);
    }
}
