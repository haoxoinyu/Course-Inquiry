package com.mengyunzhi.springBootStudy.repository;

import com.mengyunzhi.springBootStudy.entity.Klass;
import com.mengyunzhi.springBootStudy.entity.School;
import com.mengyunzhi.springBootStudy.repository.spec.SchoolSpecs;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.util.Assert;

import javax.validation.constraints.NotNull;
import java.util.List;

/**
 * 教师仓库
 */
public interface SchoolRepository extends PagingAndSortingRepository<School, Long> , JpaSpecificationExecutor {
    /**
     * 综合查询
     * @param name containing 学校名称
     * @param pageable
     * @return
     */
    default Page findAll(String name, @NotNull Pageable pageable) {
        Assert.notNull(pageable, "传入的Pageable不能为null");

        Specification<School> specification = SchoolSpecs.containingName(name);
        return this.findAll(specification, pageable);
    }

    List<School> findAllByNameContains(String name);

    @Override
    List<School> findAll();
}
