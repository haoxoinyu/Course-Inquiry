package com.mengyunzhi.springBootStudy.repository;

import com.mengyunzhi.springBootStudy.entity.Course;
import com.mengyunzhi.springBootStudy.entity.Klass;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface CourseRepository extends CrudRepository<Course, Long> {
    /**
     * 课程名称是否存在
     * @param name 课程名称
     * @return true 存在
     */
    boolean existsByName(String name);

    List<Course> findAllByNameContains(String name);
}
