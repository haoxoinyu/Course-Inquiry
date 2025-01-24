package com.mengyunzhi.springBootStudy.service;

import com.mengyunzhi.springBootStudy.entity.*;
import com.mengyunzhi.springBootStudy.repository.TermRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;

/**
 * 学期服务实现
 */
@Service
public class TermServiceImpl implements TermService {
    /*学期仓库*/
    @Autowired
    TermRepository termRepository;

    @Autowired
    CourseService courseService;

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public ResponseEntity<Map<String, Object>> deleteById(Long id) {
        Map<String, Object> response = new HashMap<>();

        Term term = this.termRepository.findById(id).get();

        // 检查班级是否有用户
        List<Course> courseList = this.courseService.findByTermId(term.getId());
        if (!courseList.isEmpty()) {
            response.put("status", "error");
            response.put("message", "该学期仍有课程未清空");
            return ResponseEntity.ok(response);
        }

        // 如果用户已经清空，删除班级
        this.termRepository.deleteById(id);
        response.put("status", "success");
        response.put("message", "删除成功");
        return ResponseEntity.ok(response);
    }

    @Override
    public Page<Term> findAll(Pageable pageable) {
        return this.termRepository.findAll(pageable);
    }

    @Override
    public Page<Term> findAll(String name, Long schoolId, @NotNull Pageable pageable) {
        Assert.notNull(pageable, "Pageable不能为null");

        School school = new School();
        school.setId(schoolId);

        return this.termRepository.findAll(name, school, pageable);
    }

    @Override
    public List<Term> getTermBySchool(School school) {
        return this.termRepository.findBySchoolId(school);
    }

    @Override
    public Optional<Term> getCurrentTermBySchool(Long schoolId, Date today) {
        School school = new School();
        school.setId(schoolId);
        System.out.println(schoolId);
        return termRepository.findCurrentTermBySchool(school, today);
    }
    /**
     * 获取某个班级
     *
     * @param id 班级ID
     * @return 班级
     */
    @Override
    public Term getById(Long id) {
        return this.termRepository.findById(id).get();
    }

    @Override
    public ResponseEntity<Map<String, Object>> save(Term term) {
        Map<String, Object> response = new HashMap<>();

        if(!this.validateTermOnly(term)){
            response.put("status", "error");
            response.put("message", "该学期已存在");
            return ResponseEntity.ok(response);
        }

        if(!this.validateTermTime(term)){
            response.put("status", "error");
            response.put("message", "已存在相似时间的学期");
            return ResponseEntity.ok(response);
        }

        this.termRepository.save(term);
        response.put("status", "success");
        response.put("message", "新增成功");
        return ResponseEntity.ok(response);
    }

    /**
     * 更新班级
     * 获取数据库中的老数据
     * 使用传入的新数据对老数据的更新字段赋值
     * 将更新后的老数据重新保存在数据表中
     *
     * @param id    要更新的班级ID
     * @param term 新学期数据
     */
    @Override
    public ResponseEntity<Map<String, Object>> update(Long id, Term term) {

        Term oldTerm = this.termRepository.findById(id).get();

        Map<String, Object> response = new HashMap<>();

        if(!this.validateTermOnly(term)){
            response.put("status", "error");
            response.put("message", "该学期已存在");
            return ResponseEntity.ok(response);
        }

        if(!this.validateTermTime(term)){
            response.put("status", "error");
            response.put("message", "已存在相似时间的学期");
            return ResponseEntity.ok(response);
        }

        oldTerm.setName(term.getName());
        oldTerm.setStartTime(term.getStartTime());
        oldTerm.setEndTime(term.getEndTime());
        oldTerm.setSchool(term.getSchool());
        termRepository.save(oldTerm);
        response.put("status", "success");
        response.put("message", "编辑成功");
        return ResponseEntity.ok(response);
    }

    @Override
    public boolean validateTermOnly(Term term) {
        // 使用数据库查询，验证是否已经存在相同的Klass
        String hql = "FROM Term t WHERE t.name = :name AND t.school.id = :schoolId";
        List<Term> result = entityManager.createQuery(hql, Term.class)
                .setParameter("name", term.getName())
                .setParameter("schoolId", term.getSchool().getId())
                .getResultList();

        // 如果查询结果为空，则表示没有重复的名称，返回true
        if (result.isEmpty()) {
            return true;
        }

        // 如果查询到一条数据且Id相同，则返回true
        if (result.size() == 1) {
            Term existingTerm = result.get(0);
            return existingTerm.getId().equals(term.getId());
        }

        // 如果查询到多条数据或Id不同，则返回false
        return false;
    }

    @Override
    public boolean validateTermTime(Term term) {
        // 获取传入学期的开始和结束时间
        Date newStart = term.getStartTime();
        Date newEnd = term.getEndTime();

        // 使用 HQL 或 JPQL 查询可能重叠的学期
        String hql = "SELECT t FROM Term t WHERE :newStart < t.endTime AND t.startTime < :newEnd AND t.school.id = :schoolId";
        List<Term> result = entityManager.createQuery(hql, Term.class)
                .setParameter("newStart", newStart)
                .setParameter("newEnd", newEnd)
                .setParameter("schoolId", term.getSchool().getId())
                .getResultList();

        // 如果查询结果为空，则表示没有重复的名称，返回true
        if (result.isEmpty()) {
            return true;
        }

        // 如果查询到一条数据且Id相同，则返回true
        if (result.size() == 1) {
            Term existingTerm = result.get(0);
            return existingTerm.getId().equals(term.getId());
        }

        return false;
    }

}
