package com.mengyunzhi.springBootStudy.service;

import com.mengyunzhi.springBootStudy.entity.Klass;
import com.mengyunzhi.springBootStudy.entity.School;
import com.mengyunzhi.springBootStudy.entity.Term;
import com.mengyunzhi.springBootStudy.entity.User;
import com.mengyunzhi.springBootStudy.repository.SchoolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.validation.constraints.NotNull;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 学校服务实现
 */
@Service
public class SchoolServiceImpl implements SchoolService {
    /*学校仓库*/
    @Autowired
    SchoolRepository schoolRepository;
    
    @Autowired
    KlassService klassService;

    @Autowired
    TermService termService;

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public ResponseEntity<Map<String, Object>> save(School school) {
        Map<String, Object> response = new HashMap<>();

        if(!this.validateSchool(school)){
            response.put("status", "error");
            response.put("message", "该学校已存在");
            return ResponseEntity.ok(response);
        } else {
            this.schoolRepository.save(school);
            response.put("status", "success");
            response.put("message", "新增成功");
            return ResponseEntity.ok(response);
        }
    }

    @Override
    public boolean validateSchool(School school) {
        // 使用数据库查询，验证是否已经存在相同的Klass
        String hql = "FROM School s WHERE s.name = :name";
        List<School> result = entityManager.createQuery(hql, School.class)
                .setParameter("name", school.getName())
                .getResultList();

        // 如果查询结果为空，则表示没有重复的学校名称，返回true
        if (result.isEmpty()) {
            return true;
        }

        // 如果查询到一条数据且schoolId相同，则返回true
        if (result.size() == 1) {
            School existingSchool = result.get(0);
            return existingSchool.getId().equals(school.getId());
        }

        // 如果查询到多条数据或schoolId不同，则返回false
        return false;
    }

    @Override
    public Page<School> findAll(Pageable pageable) {
        return this.schoolRepository.findAll(pageable);
    }

    @Override
    public List<School> getAll() {
        return this.schoolRepository.findAll();
    }

    @Override
    public Page<School> findAll(String name, @NotNull Pageable pageable) {
        Assert.notNull(pageable, "Pageable不能为null");
        return this.schoolRepository.findAll(name, pageable);
    }

    @Override
    public School findById(@NotNull Long id) {
        Assert.notNull(id, "id不能为null");
        return this.schoolRepository.findById(id).get();
    }

    @Override
    public ResponseEntity<Map<String, Object>> update(Long id, School school) {
        School oldSchool = this.schoolRepository.findById(id).get();

        Map<String, Object> response = new HashMap<>();

        if(!this.validateSchool(school)){
            response.put("status", "error");
            response.put("message", "该学校已存在");
            return ResponseEntity.ok(response);
        } else {
            this.updateFields(school,oldSchool);
            response.put("status", "success");
            response.put("message", "编辑成功");
            return ResponseEntity.ok(response);
        }
    }

    @Override
    public ResponseEntity<Map<String, Object>> deleteById(@NotNull Long id) {
        Assert.notNull(id, "传入的ID不能为NULL");

        Map<String, Object> response = new HashMap<>();

        School school = this.schoolRepository.findById(id).get();

        // 检查学校是否有班级
        List<Klass> klassList = this.klassService.getKlassBySchool(school);
        if (!klassList.isEmpty()) {
            response.put("status", "error");
            response.put("message", "该学校仍有班级未清空");
            return ResponseEntity.ok(response);
        }

        // 检查学校是否有学期
        List<Term> termList = this.termService.getTermBySchool(school);
        if (!termList.isEmpty()) {
            response.put("status", "error");
            response.put("message", "该学校仍有学期未清空");
            return ResponseEntity.ok(response);
        }

        // 如果班级和学期都已经清空，删除学校
        this.schoolRepository.deleteById(id);
        response.put("status", "success");
        response.put("message", "删除成功");
        return ResponseEntity.ok(response);
    }


    /**
     * 更新学生
     * @param newSchool 新学生信息
     * @param oldSchool 老学生信息
     * @return 更新后的学生信息
     */
    public School updateFields(School newSchool, School oldSchool) {
        oldSchool.setName(newSchool.getName());
        return this.schoolRepository.save(oldSchool);
    }
}
