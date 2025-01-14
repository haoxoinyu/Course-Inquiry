package com.mengyunzhi.springBootStudy.service;

import com.mengyunzhi.springBootStudy.entity.Klass;
import com.mengyunzhi.springBootStudy.entity.School;
import com.mengyunzhi.springBootStudy.entity.Term;
import com.mengyunzhi.springBootStudy.repository.KlassRepository;
import com.mengyunzhi.springBootStudy.repository.TermRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import javax.validation.constraints.NotNull;

/**
 * 学期服务实现
 */
@Service
public class TermServiceImpl implements TermService {
    /*学期仓库*/
    @Autowired
    TermRepository termRepository;

    @Override
    public void deleteById(Long id) {
        this.termRepository.deleteById(id);
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
    public void save(Term term) {
        this.termRepository.save(term);
    }

    /**
     * 更新班级
     * 获取数据库中的老数据
     * 使用传入的新数据对老数据的更新字段赋值
     * 将更新后的老数据重新保存在数据表中
     *
     * @param id    要更新的班级ID
     * @param term 新班级数据
     */
    @Override
    public void update(Long id, Term term) {
        Term oldTerm = termRepository.findById(id).get();
        oldTerm.setName(term.getName());
        oldTerm.setSchool(term.getSchool());
        termRepository.save(oldTerm);
    }
}
