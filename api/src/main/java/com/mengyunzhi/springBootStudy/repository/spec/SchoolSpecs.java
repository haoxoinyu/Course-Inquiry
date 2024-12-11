package com.mengyunzhi.springBootStudy.repository.spec;

import com.mengyunzhi.springBootStudy.entity.School;
import org.springframework.data.jpa.domain.Specification;

public class SchoolSpecs {
    public static Specification<School> containingName(String name) {
        if (name != null) {
            return (Specification<School>) (root, criteriaQuery, criteriaBuilder) -> criteriaBuilder.like(root.get("name").as(String.class), String.format("%%%s%%", name));
        } else {
            return Specification.where(null);
        }
    }

    public static Specification<School> startWithId(String id) {
        if (id == null) {
            return Specification.where(null);
        }
        return (Specification<School>) (root, criteriaQuery, criteriaBuilder) -> criteriaBuilder.like(root.get("sno").as(String.class), String.format("%s%%", id));
    }
}
