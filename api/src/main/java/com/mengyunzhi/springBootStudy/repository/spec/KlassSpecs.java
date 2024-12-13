package com.mengyunzhi.springBootStudy.repository.spec;

import com.mengyunzhi.springBootStudy.entity.Klass;
import com.mengyunzhi.springBootStudy.entity.School;
import org.springframework.data.jpa.domain.Specification;

public class KlassSpecs {
    public static Specification<Klass> containingName(String name) {
        if (name != null) {
            return (Specification<Klass>) (root, criteriaQuery, criteriaBuilder) -> criteriaBuilder.like(root.get("name").as(String.class), String.format("%%%s%%", name));
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
    public static Specification<Klass> belongToSchool(School school) {
        if (null == school || null == school.getId()) {
            return Specification.where(null);
        }
        return (Specification<Klass>) (root, criteriaQuery, criteriaBuilder) -> criteriaBuilder.equal(root.get("school").as(School.class), school);
    }
}
