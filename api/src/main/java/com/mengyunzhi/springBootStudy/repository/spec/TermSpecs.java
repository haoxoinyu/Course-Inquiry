package com.mengyunzhi.springBootStudy.repository.spec;

import com.mengyunzhi.springBootStudy.entity.*;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.*;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;

public class TermSpecs {
    public static Specification<Term> containingName(String name) {
        if (name != null) {
            return (Specification<Term>) (root, criteriaQuery, criteriaBuilder) -> criteriaBuilder.like(root.get("name").as(String.class), String.format("%%%s%%", name));
        } else {
            return Specification.where(null);
        }
    }

    /**
     * 属于某个学校
     *
     * @param school 学校
     * @return
     */
    public static Specification<Term> belongToSchool(School school) {
        if (null == school || null == school.getId()) {
            return Specification.where(null);
        }
        return (Specification<Term>) (root, criteriaQuery, criteriaBuilder) -> criteriaBuilder.equal(root.get("school").as(School.class), school);
    }

    /**
     * 日期小于结束时间
     * */
    public static Specification<Term> greaterThanDate(Date date) {
        if (date != null) {
            return new Specification<Term>() {
                @Override
                public Predicate toPredicate(Root<Term> root, CriteriaQuery<?> criteriaQuery, CriteriaBuilder criteriaBuilder) {
                    return criteriaBuilder.greaterThan(root.get("endTime"), date) ;
                }
            };
        } else {
            return Specification.where(null);
        }
    }

    /**
     * 日期大于开始时间
     * */
    public static Specification<Term> lessThanDate(Date date) {
        if (date != null) {
            return new Specification<Term>() {
                @Override
                public Predicate toPredicate(Root<Term> root, CriteriaQuery<?> criteriaQuery, CriteriaBuilder criteriaBuilder) {
                    return criteriaBuilder.lessThan(root.get("startTime"), date) ;
                }
            };
        } else {
            return Specification.where(null);
        }
    }
}
