package com.mengyunzhi.springBootStudy.service;


import com.mengyunzhi.springBootStudy.entity.Course;
import com.mengyunzhi.springBootStudy.entity.Term;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

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
    ResponseEntity<Map<String, Object>> save(Course course);

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
    ResponseEntity<Map<String, Object>> update(Long id, Course klass);

    /**
     * 综合查询
     * @param name 课程名
     * @param klassId 班级id
     * @param schoolId 学校id
     * @param termId 学期id
     * @param userId 学生id
     * @param pageable 分页参数
     * */
    Page<Course> findAll(String name, Long schoolId, Long klassId, Long termId, Long userId, @NotNull Pageable pageable);

    Page<Course> findCoursesByCriteria(Long termId, String courseName, Long sory, Long userId, @NotNull Pageable pageable);

    ArrayList<Course> getCoursesByTermId(Long termId, Long sory);

    ArrayList<Course> findByTermId(Long termId);
    /**
     * 通过id寻找course
     *
     * @param courseId 课程id
     **/
    Optional<Course> findById(Long courseId);

    List<Course> findAll(Long schoolId, Long klassId, Long termId, Long usrId, List<Integer> week);
}
