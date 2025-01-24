package com.mengyunzhi.springBootStudy.repository;

import com.mengyunzhi.springBootStudy.entity.Klass;
import com.mengyunzhi.springBootStudy.entity.School;
import com.mengyunzhi.springBootStudy.entity.Term;
import com.mengyunzhi.springBootStudy.repository.spec.KlassSpecs;
import com.mengyunzhi.springBootStudy.repository.spec.TermSpecs;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.util.Assert;

import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Optional;

/**
 * 教师仓库
 */
public interface TermRepository extends PagingAndSortingRepository<Term, Long>, JpaSpecificationExecutor {
    /**
     * 综合查询
     * @param name containing 班级名称
     * @param school 学校
     * @param pageable
     * @return
     */
    default Page findAll(String name, School school, @NotNull Pageable pageable) {
        Assert.notNull(pageable, "传入的Pageable不能为null");

        Specification<Term> specification = TermSpecs.containingName(name)
                .and(TermSpecs.belongToSchool(school));
        return this.findAll(specification, pageable);
    }

    default List<Term> findBySchoolId(School school) {
        Specification<Term> specification = TermSpecs.belongToSchool(school);
        return this.findAll(specification);
    }

    default Optional<Term> findCurrentTermBySchool(School school, Date today) {
        if (school == null || school.getId() == null) {
            System.out.println("学校信息不完整");
            return Optional.empty();
        }
        if (today == null) {
            System.out.println("今天信息不完整");
            return Optional.empty();
        }
        Specification<Term> spec = TermSpecs.lessThanDate(today)
                        .and(TermSpecs.greaterThanDate(today))
                        .and(TermSpecs.belongToSchool(school));
        Optional<Term> result = findAll(spec).stream().findFirst();

        // 打印结果
        if (result.isPresent()) {
            System.out.println("查询成功，找到的学期为: " + result.get());
        } else {
            System.out.println("查询失败，没有找到匹配的学期");
        }

        return result;
    }

    default List<Term> findTermsInRange(Date date) {
        Specification<Term> specification = TermSpecs.greaterThanDate(date)
                .and(TermSpecs.lessThanDate(date));
        return this.findAll(specification);
    };

}
