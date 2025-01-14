package com.mengyunzhi.springBootStudy.service;

import com.mengyunzhi.springBootStudy.entity.Klass;
import com.mengyunzhi.springBootStudy.entity.School;
import com.mengyunzhi.springBootStudy.repository.KlassRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import javax.validation.constraints.NotNull;

/**
 * 班级服务实现
 */
@Service
public class KlassServiceImpl implements KlassService {
    /*班级仓库*/
    @Autowired
    KlassRepository klassRepository;

    @Override
    public void deleteById(Long id) {
        this.klassRepository.deleteById(id);
    }

    @Override
    public Page<Klass> findAll(Pageable pageable) {
        return this.klassRepository.findAll(pageable);
    }

    @Override
    public Page<Klass> findAll(String name, Long schoolId, @NotNull Pageable pageable) {
        Assert.notNull(pageable, "Pageable不能为null");

        School school = new School();
        school.setId(schoolId);

        return this.klassRepository.findAll(name, school, pageable);
    }

    /**
     * 获取某个班级
     *
     * @param id 班级ID
     * @return 班级
     */
    @Override
    public Klass getById(Long id) {
        return this.klassRepository.findById(id).get();
    }

    @Override
    public void save(Klass klass) {
        this.klassRepository.save(klass);
    }

    /**
     * 更新班级
     * 获取数据库中的老数据
     * 使用传入的新数据对老数据的更新字段赋值
     * 将更新后的老数据重新保存在数据表中
     *
     * @param id    要更新的班级ID
     * @param klass 新班级数据
     */
    @Override
    public void update(Long id, Klass klass) {
        Klass oldKlass = klassRepository.findById(id).get();
        oldKlass.setName(klass.getName());
        oldKlass.setSchool(klass.getSchool());
        klassRepository.save(oldKlass);
    }
}
