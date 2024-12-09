package com.mengyunzhi.springBootStudy.service;

import com.mengyunzhi.springBootStudy.entity.Term;

import java.util.List;

/**
 * 学期服务
 */
public interface TermService {

    /**
     * 删除
     *
     * @param id 学期ID
     */
    void deleteById(Long id);

    /**
     * 获取所有学期列表
     *
     * @param name 学期名称
     * @return
     */
    List<Term> getAll(String name);

    /**
     * 通过ID获取学期
     *
     * @param id 学期ID
     * @return 学期实体
     */
    Term getById(Long id);

    /**
     * 新增
     *
     * @param klass 学期
     */
    void save(Term klass);

    /**
     * 更新学期
     *
     * @param id    预更新的学期ID
     * @param klass 新的学期信息
     */
    void update(Long id, Term klass);
}
