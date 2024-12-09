package com.mengyunzhi.springBootStudy.service;


import com.mengyunzhi.springBootStudy.entity.Course;

import java.util.List;

/**
 * 课程
 * @author panjie
 */
public interface CourseService {
    /**
     * 新增课程
     * @param course 课程
     * @return 课程
     */
    Course save(Course course);

    /**
     * 名称是否存在
     * @param name 课程名称
     * @return true 存在
     */
    boolean existsByName(String name);

    /**
     * 删除
     *
     * @param id 课程ID
     */
    void deleteById(Long id);

    /**
     * 获取所有课程列表
     *
     * @param name 课程名称
     * @return
     */
    List<Course> getAll(String name);

    /**
     * 通过ID获取课程
     *
     * @param id 课程ID
     * @return 课程实体
     */
    Course getById(Long id);

    /**
     * 更新课程
     *
     * @param id    预更新的课程ID
     * @param klass 新的课程信息
     */
    void update(Long id, Course klass);
}
