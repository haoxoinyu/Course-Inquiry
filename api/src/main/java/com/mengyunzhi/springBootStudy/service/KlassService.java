package com.mengyunzhi.springBootStudy.service;

import com.mengyunzhi.springBootStudy.entity.Klass;
import com.mengyunzhi.springBootStudy.entity.School;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import javax.validation.constraints.NotNull;
import java.util.List;

/**
 * 班级服务
 */
public interface KlassService {

    /**
     * 删除
     *
     * @param id 班级ID
     */
    void deleteById(Long id);

    /**
     * 查询分页信息
     *
     * @param pageable 分页条件
     * @return 分页数据
     */
    Page<Klass> findAll(Pageable pageable);

    /**
     * 综合查询
     * @param name containing 班级名称
     * @param schoolId 学校ID
     * @param pageable
     * @return
     */
    Page<Klass> findAll(String name, Long schoolId, @NotNull Pageable pageable);

    /**
     * 通过ID获取班级
     *
     * @param id 班级ID
     * @return 班级实体
     */
    Klass getById(Long id);

    /**
     * 新增
     *
     * @param klass 班级
     */
    void save(Klass klass);

    /**
     * 更新班级
     *
     * @param id    预更新的班级ID
     * @param klass 新的班级信息
     */
    void update(Long id, Klass klass);
}
