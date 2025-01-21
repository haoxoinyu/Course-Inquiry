package com.mengyunzhi.springBootStudy.repository.spec;

import com.mengyunzhi.springBootStudy.entity.*;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.*;
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
                    Join<Course, Term> termJoin = root.join("term");
                    Join<Term, School> schoolJoin = termJoin.join("school");

                    //定义子查询语句
                    Subquery<Long> subquery = criteriaQuery.subquery(Long.class);
                    //构建子查询语句的from成分
                    Root<School> schoolSubRoot = subquery.from(School.class);
                    //join klass表
                    Join<School, Klass> klassJoin = schoolSubRoot.join("klass"); // klass是School中Klass列表的属性名
                    //子查询的select部分
                    subquery.select(schoolSubRoot.get("id"));
                    //构建where查询条件语句
                    Predicate klassPredicate = criteriaBuilder.equal(klassJoin.get("id"), klass.getId()); // 比较Klass的ID
                    subquery.where(klassPredicate);

                    // 在主查询中使用IN子句来检查School的ID是否在子查询结果中，选择那些其School的id在子查询结果集中的Course实体
                    Predicate inPredicate = criteriaBuilder.in(schoolJoin.get("id")).value(subquery);
                    return inPredicate;
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
}
