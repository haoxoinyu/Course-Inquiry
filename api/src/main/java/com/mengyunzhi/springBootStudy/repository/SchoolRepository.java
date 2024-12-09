package com.mengyunzhi.springBootStudy.repository;

import com.mengyunzhi.springBootStudy.entity.School;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

/**
 * 教师仓库
 */
public interface SchoolRepository extends CrudRepository<School, Long> {
    List<School> findAllByNameContains(String name);
}
