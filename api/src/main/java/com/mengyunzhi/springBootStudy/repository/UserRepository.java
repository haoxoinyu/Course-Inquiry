package com.mengyunzhi.springBootStudy.repository;

import com.mengyunzhi.springBootStudy.entity.Klass;
import com.mengyunzhi.springBootStudy.entity.School;
import com.mengyunzhi.springBootStudy.entity.Klass;
import com.mengyunzhi.springBootStudy.entity.User;
import com.mengyunzhi.springBootStudy.repository.spec.KlassSpecs;
import com.mengyunzhi.springBootStudy.repository.spec.UserSpecs;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.util.Assert;

import javax.validation.constraints.NotNull;

import java.util.List;

/**
 * 用户仓库
 */
public interface UserRepository extends PagingAndSortingRepository<User, Long>, JpaSpecificationExecutor {

    /**
     * 综合查询
     *
     * @param username
     * @param klass
     * @param role
     * @param state
     * @param pageable
     * @return
     */
    default Page findAll(String username, Klass klass, Long role, Long state, @NotNull Pageable pageable) {
        Assert.notNull(pageable, "传入的Pageable不能为null");

        Specification<User> specification = UserSpecs.containingName(username)
                .and(UserSpecs.belongToKlass(klass))
                .and(UserSpecs.Role(role)
                .and(UserSpecs.State(state)));
        // 将排序规则加入Pageable，按role升序排列
        Pageable sortedPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by(Sort.Order.asc("role")));

        return this.findAll(specification, sortedPageable);
    }

    /**
     * 查找用户
     * @param username 用户名
     * @return
     */
    User findByUsername(String username);

    List<User> findByKlass(Klass klass);
}
