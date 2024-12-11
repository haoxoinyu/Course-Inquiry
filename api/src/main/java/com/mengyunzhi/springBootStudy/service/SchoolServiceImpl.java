package com.mengyunzhi.springBootStudy.service;

import com.mengyunzhi.springBootStudy.entity.Klass;
import com.mengyunzhi.springBootStudy.entity.School;
import com.mengyunzhi.springBootStudy.repository.SchoolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import javax.validation.constraints.NotNull;
import java.util.List;

/**
 * 学校服务实现
 */
@Service
public class SchoolServiceImpl implements SchoolService {
    /*学校仓库*/
    @Autowired
    SchoolRepository schoolRepository;

    @Override
    public School save(School school) {
        return this.schoolRepository.save(school);
    }

    @Override
    public Page<School> findAll(Pageable pageable) {
        return this.schoolRepository.findAll(pageable);
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
    public School update(Long id, School school) {
        School oldSchool = this.schoolRepository.findById(id).get();
        return this.updateFields(school,oldSchool);
    }

    @Override
    public void deleteById(@NotNull Long id) {
        Assert.notNull(id, "传入的ID不能为NULL");
        this.schoolRepository.deleteById(id);
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
