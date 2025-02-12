package com.mengyunzhi.springBootStudy.service;

import com.mengyunzhi.springBootStudy.entity.Klass;
import com.mengyunzhi.springBootStudy.entity.School;
import com.mengyunzhi.springBootStudy.entity.Term;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;

import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface TermService {
    /**
     * 删除
     *
     * @param id 学期ID
     */
    ResponseEntity<Map<String, Object>> deleteById(Long id);

    List<Term> getTermBySchool(School school);

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
     */
    ResponseEntity<Map<String, Object>> save(Term term);

    /**
     * 更新班级
     *
     * @param id    预更新的班级ID
     * @param term 新的班级信息
     */
    ResponseEntity<Map<String, Object>> update(Long id, Term term);

    /**
     * 验证
     * @param term
     * @return
     */
    boolean validateTermOnly(@NotNull Term term);

    /**
     * 验证
     * @param term
     * @return
     */
    boolean validateTermTime(@NotNull Term term);

    Optional<Term> getCurrentTermBySchool(Long schoolId, Date today);

    boolean getCoursesByTerm(Long termId);

    List<Map<String, String>> getCurrencyWeekOfEachSchool(String firstDayOfCurrentWeek);
}