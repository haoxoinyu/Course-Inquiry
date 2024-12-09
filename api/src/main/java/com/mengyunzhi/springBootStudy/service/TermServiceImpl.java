package com.mengyunzhi.springBootStudy.service;

import com.mengyunzhi.springBootStudy.entity.Term;
import com.mengyunzhi.springBootStudy.repository.TermRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

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
    public List<Term> getAll(String name) {
        return this.termRepository.findAllByNameContains(name);
    }


    /**
     * 获取某个学期
     *
     * @param id 学期ID
     * @return 学期
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
     * 更新学期
     * 获取数据库中的老数据
     * 使用传入的新数据对老数据的更新字段赋值
     * 将更新后的老数据重新保存在数据表中
     *
     * @param id    要更新的学期ID
     * @param term 新学期数据
     */
    @Override
    public void update(Long id, Term term) {
        Term oldTerm = termRepository.findById(id).get();
        oldTerm.setName(term.getName());
        oldTerm.setSchool(term.getSchool());
        termRepository.save(oldTerm);
    }
}
