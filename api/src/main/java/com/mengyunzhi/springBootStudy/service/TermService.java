package com.mengyunzhi.springBootStudy.service;

import com.mengyunzhi.springBootStudy.entity.Term;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import javax.validation.constraints.NotNull;

public interface TermService {
    /**
     * 删除
     *
     * @param id 学期ID
     */
    void deleteById(Long id);

    /**
     * 查询分页信息
     *
     * @param pageable 分页条件
     * @return 分页数据
     */
    Page<Term> findAll(Pageable pageable);

    /**
     * 综合查询
     *
     * @param name     containing 班级名称
     * @param schoolId 学校ID
     * @param pageable
     * @return
     */
    Page<Term> findAll(String name, Long schoolId, @NotNull Pageable pageable);

    /**
     * 通过ID获取班级
     *
     * @param id 班级ID
     * @return 班级实体
     */
    Term getById(Long id);

    /**
     * 新增
     *
     * @param term 班级
     * @return
     */
    Term save(Term term);

    /**
     * 更新班级
     *
     * @param id    预更新的班级ID
     * @param term 新的班级信息
     */
    void update(Long id, Term term);

    // 检查学期名称是否存在
    boolean checkIfNameExists(String name);
}