package com.mengyunzhi.springBootStudy.service;

import com.mengyunzhi.springBootStudy.entity.School;
import com.mengyunzhi.springBootStudy.repository.SchoolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
    public void deleteById(Long id) {
        this.schoolRepository.deleteById(id);
    }

    @Override
    public List<School> getAll(String name) {
        return this.schoolRepository.findAllByNameContains(name);
    }


    /**
     * 获取某个学校
     *
     * @param id 学校ID
     * @return 学校
     */
    @Override
    public School getById(Long id) {
        return this.schoolRepository.findById(id).get();
    }

    @Override
    public void save(School school) {
        this.schoolRepository.save(school);
    }

    /**
     * 更新学校
     * 获取数据库中的老数据
     * 使用传入的新数据对老数据的更新字段赋值
     * 将更新后的老数据重新保存在数据表中
     *
     * @param id    要更新的学校ID
     * @param school 新学校数据
     */
    @Override
    public void update(Long id, School school) {
        School oldSchool = schoolRepository.findById(id).get();
        oldSchool.setName(school.getName());
        schoolRepository.save(oldSchool);
    }
}
