package com.mengyunzhi.springBootStudy.repository.spec;

import com.mengyunzhi.springBootStudy.entity.Term;
import com.mengyunzhi.springBootStudy.entity.School;
import org.springframework.data.jpa.domain.Specification;

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
}
