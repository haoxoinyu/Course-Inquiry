package com.mengyunzhi.springBootStudy.repository;

import com.mengyunzhi.springBootStudy.entity.Term;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

/**
 * 教师仓库
 */
public interface TermRepository extends CrudRepository<Term, Long> {
    List<Term> findAllByNameContains(String name);
}
