package com.mengyunzhi.springBootStudy.repository.spec;

import com.mengyunzhi.springBootStudy.entity.*;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.*;
import java.util.List;

public class CourseSpecs {

    /**
     * 属于某个班级
     * @param klass 班级
     * @return
     * */
    public static Specification<Course> belongToKlass(Klass klass) {

        if(klass == null || null == klass.getId()) {
            System.out.println("klass为null");
            return Specification.where(null);
        }else {
            return new Specification<Course>() {
                @Override
                public Predicate toPredicate(Root<Course> root, CriteriaQuery<?> criteriaQuery, CriteriaBuilder criteriaBuilder) {
                    Join<Course, User> userJoin = root.join("users", JoinType.INNER);
                    Join<User, Klass> klassJoin = userJoin.join("klass");
                    return criteriaBuilder.equal(klassJoin.get("id"), klass.getId()) ;
                }
            };
        }
    }

    /**
     * 属于某个学校
     * @param school 学校
     * @return
     * */
    public static Specification<Course> belongToSchool(School school) {
        if(school == null || null == school.getId()) {
            return Specification.where(null);
        }else {
            return new Specification<Course>() {
                @Override
                public Predicate toPredicate(Root<Course> root, CriteriaQuery<?> criteriaQuery, CriteriaBuilder criteriaBuilder) {
                    Join<Course, Term> termJoin = root.join("term");
                    Join<Term, School> schoolJoin = termJoin.join("school");

                    return criteriaBuilder.equal(schoolJoin.get("id"), school.getId());
                }
            };
        }
    }

    /**
     * 属于某个学生
     * @param user 学生
     * @return
     * */
    public static Specification<Course> belongToUser(User user) {
        if(user == null || null == user.getId()) {
            return Specification.where(null);
        }else {
            return new Specification<Course>() {
                @Override
                public Predicate toPredicate(Root<Course> root, CriteriaQuery<?> criteriaQuery, CriteriaBuilder criteriaBuilder) {
                    Join<Course, User> userJoin = root.join("users", JoinType.INNER);
                    return criteriaBuilder.equal(userJoin.get("id"), user.getId());
                }
            };
        }
    }

    /**
     * 属于某个学期
     * @param term 学期
     * @return
     * */
    public static Specification<Course> belongToTerm(Term term) {
        if(term == null || null == term.getId()) {
            System.out.println("term为null");
            return Specification.where(null);
        }else {
            return new Specification<Course>() {
                @Override
                public Predicate toPredicate(Root<Course> root, CriteriaQuery<?> criteriaQuery, CriteriaBuilder criteriaBuilder) {
                    return criteriaBuilder.equal(root.get("term").as(Term.class), term);
                }
            };
        }
    }

    /**
     * 名字模糊查询
     * @param name 名字
     * @return
     * */
    public static Specification<Course> nameContain(String name) {
        if(name == null) {
            return Specification.where(null);
        }else {
            return (Specification<Course>) (Root<Course> root, CriteriaQuery<?> criteriaQuery, CriteriaBuilder criteriaBuilder) -> criteriaBuilder.like(root.get("name").as(String.class), String.format("%%%s%%", name));
        }
    }

    public static Specification<Course> Sory(Long sory) {
        if (sory != null) {
            return (Specification<Course>) (root, criteriaQuery, criteriaBuilder) -> criteriaBuilder.equal(root.get("sory").as(Long.class), sory);
        } else {
            return Specification.where(null);
        }
    }

    /**
     * 根据周数查询课程
     * @param week 周数
     * @return Specification<Course>
     */
    public static Specification<Course> belongToWeek(List<Integer> week) {
        if (week == null) {
            return Specification.where(null);
        } else {
            return (Specification<Course>) (Root<Course> root, CriteriaQuery<?> criteriaQuery, CriteriaBuilder criteriaBuilder) -> {
                // 检查 week 列表中是否包含指定的周数
                return criteriaBuilder.isMember(week, root.get("week"));
            };
        }
    }

    /**
     * 根据时间段查询课程
     * @param period 周数
     * @return Specification<Course>
     */
    public static Specification<Course> belongToPeriod(List<Integer> period) {
        if (period == null) {
            return Specification.where(null);
        } else {
            return (Specification<Course>) (Root<Course> root, CriteriaQuery<?> criteriaQuery, CriteriaBuilder criteriaBuilder) -> {
                // 检查 week 列表中是否包含指定的周数
                return criteriaBuilder.isMember(period, root.get("period"));
            };
        }
    }

    /**
     * 根据星期数段查询课程
     * @param day 星期数
     * @return Specification<Course>
     */
    public static Specification<Course> belongToDay(List<Integer> day) {
        if (day == null) {
            return Specification.where(null);
        } else {
            return (Specification<Course>) (Root<Course> root, CriteriaQuery<?> criteriaQuery, CriteriaBuilder criteriaBuilder) -> {
                // 检查 week 列表中是否包含指定的周数
                return criteriaBuilder.isMember(day, root.get("day"));
            };
        }
    }

}
