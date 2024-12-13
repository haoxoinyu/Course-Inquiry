package com.mengyunzhi.springBootStudy.service;

import com.mengyunzhi.springBootStudy.entity.Klass;
import com.mengyunzhi.springBootStudy.entity.School;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import javax.validation.constraints.NotNull;
import java.util.List;

/**
 * 学校服务
 */
public interface SchoolService {

    /**
     * 保存
     *
     * @param school 保存前的学校
     * @return 保存后的学校
     */
    School save(School school);

    /**
     * 获取所有学校列表
     *
     * @return
     */
    List<School> getAll();

    /**
     * 查询分页信息
     *
     * @param pageable 分页条件
     * @return 分页数据
     */
    Page<School> findAll(Pageable pageable);

    /**
     * 综合查询
     * @param name containing 学校名称
     * @param pageable
     * @return
     */
    Page<School> findAll(String name, @NotNull Pageable pageable);

    /**
     * 查找学校
     * @param id 学校ID
     * @return 学校
     */
    School findById(@NotNull Long id);

    /**
     * 更新学校
     * @param id ID
     * @param school 更新的学校信息
     * @return 学校
     */
    School update(Long id, School school);

    /**
     * 删除学校
     * @param id 学校id
     */
    void deleteById(@NotNull Long id);
}
