package com.mengyunzhi.springBootStudy.service;

import com.mengyunzhi.springBootStudy.entity.School;

import java.util.List;

/**
 * 学校服务
 */
public interface SchoolService {

    /**
     * 删除
     *
     * @param id 学校ID
     */
    void deleteById(Long id);

    /**
     * 获取所有学校列表
     *
     * @param name 学校名称
     * @return
     */
    List<School> getAll(String name);

    /**
     * 通过ID获取学校
     *
     * @param id 学校ID
     * @return 学校实体
     */
    School getById(Long id);

    /**
     * 新增
     *
     * @param klass 学校
     */
    void save(School klass);

    /**
     * 更新学校
     *
     * @param id    预更新的学校ID
     * @param klass 新的学校信息
     */
    void update(Long id, School klass);
}
