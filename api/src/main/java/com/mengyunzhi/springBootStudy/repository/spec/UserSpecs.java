package com.mengyunzhi.springBootStudy.repository.spec;

import com.mengyunzhi.springBootStudy.entity.Klass;
import com.mengyunzhi.springBootStudy.entity.School;
import com.mengyunzhi.springBootStudy.entity.User;
import org.springframework.data.jpa.domain.Specification;

public class UserSpecs {
    public static Specification<User> containingName(String name) {
        if (name != null) {
            return (Specification<User>) (root, criteriaQuery, criteriaBuilder) -> criteriaBuilder.like(root.get("name").as(String.class), String.format("%%%s%%", name));
        } else {
            return Specification.where(null);
        }
    }

    /**
     * 属于某个班级
     *
     * @param klass 班级
     * @return
     */
    public static Specification<User> belongToKlass(Klass klass) {
        if (null == klass || null == klass.getId()) {
            return Specification.where(null);
        }
        return (Specification<User>) (root, criteriaQuery, criteriaBuilder) -> criteriaBuilder.equal(root.get("klass").as(Klass.class), klass);
    }
}
