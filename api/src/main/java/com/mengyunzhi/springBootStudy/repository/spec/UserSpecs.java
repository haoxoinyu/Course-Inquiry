package com.mengyunzhi.springBootStudy.repository.spec;

import com.mengyunzhi.springBootStudy.entity.Klass;
import com.mengyunzhi.springBootStudy.entity.School;
import com.mengyunzhi.springBootStudy.entity.User;
import org.springframework.data.jpa.domain.Specification;

public class UserSpecs {
    public static Specification<User> containingName(String username) {
        if (username != null) {
            return (Specification<User>) (root, criteriaQuery, criteriaBuilder) -> criteriaBuilder.like(root.get("username").as(String.class), String.format("%%%s%%", username));
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

    public static Specification<User> Role(Long role) {
        if (role != null) {
            return (Specification<User>) (root, criteriaQuery, criteriaBuilder) -> criteriaBuilder.equal(root.get("role").as(Long.class), role);
        } else {
            return Specification.where(null);
        }
    }

    public static Specification<User> State(Long state) {
        if (state != null) {
            return (Specification<User>) (root, criteriaQuery, criteriaBuilder) -> criteriaBuilder.equal(root.get("state").as(Long.class), state);
        } else {
            return Specification.where(null);
        }
    }


}
