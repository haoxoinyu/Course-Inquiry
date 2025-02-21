package com.mengyunzhi.springBootStudy.repository;

import com.mengyunzhi.springBootStudy.entity.*;
import com.mengyunzhi.springBootStudy.repository.spec.CourseSpecs;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.stream.Collectors;
public interface CourseRepository extends PagingAndSortingRepository<Course, Long>, JpaSpecificationExecutor {
    /**
     * 课程名称是否存在
     * @param name 课程名称
     * @return true 存在
     */
    boolean existsByName(String name);

    List<Course> findAllByNameContains(String name);

    /**
     *综合查询
     * @param name 课程名
     * @param klass 班级
     * @param school 学校
     * @param term 学期
     * @param user 学生
     * @param pageable 分页参数
     * @return
     * */
    default Page<Course> findDistinctAll(String name, School school, Klass klass, Term term, List<Long> user, @NotNull Pageable pageable){
        if (null == pageable) {
            throw new IllegalArgumentException("传入的Pageable不能为null");
        }
        Specification<Course> specification = CourseSpecs.nameContain(name)
                .and(CourseSpecs.belongToSchool(school))
                .and(CourseSpecs.belongToTerm(term))
                .and(CourseSpecs.belongToKlassOfTheSameCourse(klass));
        Page<Course> pageData = this.findAll(specification, pageable);
        return pageData;
    }

    /**
     *综合查询
     * @param name 课程名
     * @param klass 班级
     * @param school 学校
     * @param term 学期
     * @param user 学生
     * @param pageable 分页参数
     * @return
     * */
    default Page<Course> findAll(String name, School school, Klass klass, Term term, List<Long> user, @NotNull Pageable pageable){
        if (null == pageable) {
            throw new IllegalArgumentException("传入的Pageable不能为null");
        }
        Specification<Course> specification = CourseSpecs.nameContain(name)
                .and(CourseSpecs.belongToSchool(school))
                .and(CourseSpecs.belongToTerm(term))
                .and(CourseSpecs.belongToUser(user))
                .and(CourseSpecs.belongToKlass(klass));
        Page<Course> pageData = this.findAll(specification, pageable);
        return pageData;
    }

    default Page<Course> find(Term term, String courseName, Long sory, List<Long> user, @NotNull Pageable pageable){
        if (null == pageable) {
            throw new IllegalArgumentException("传入的Pageable不能为null");
        }
        Specification<Course> specification = CourseSpecs.nameContain(courseName)
                .and(CourseSpecs.belongToTerm(term))
                .and(CourseSpecs.belongToUser(user))
                .and(CourseSpecs.Sory(sory));
        return this.findAll(specification, pageable);
    }

    default List<Course> findAll(School school, Klass klass, Term term, List<Long> user, List<Integer> week){
        Specification<Course> specification = CourseSpecs.belongToSchool(school)
                .and(CourseSpecs.belongToTerm(term))
                .and(CourseSpecs.belongToKlass(klass))
                .and(CourseSpecs.belongToUser(user))
                .and(CourseSpecs.belongToWeek(week));
        return this.findAll(specification);
    }

    @Query("SELECT c FROM Course c WHERE c.term.id = ?1 AND c.sory = ?2")
    List<Course> getCoursesByTermId(Long termId, Long sory);

    @Query("SELECT c FROM Course c WHERE c.term.id = ?1")
    List<Course> findByTermId(Long termId);

    List<Course> findByUsers(List<User> userList);
}
