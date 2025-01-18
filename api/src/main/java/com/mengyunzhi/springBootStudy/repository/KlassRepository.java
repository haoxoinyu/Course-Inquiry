package com.mengyunzhi.springBootStudy.repository;

import com.mengyunzhi.springBootStudy.entity.Klass;
import com.mengyunzhi.springBootStudy.entity.School;
import com.mengyunzhi.springBootStudy.repository.spec.KlassSpecs;
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
 * 班级仓库
 */
public interface KlassRepository extends PagingAndSortingRepository<Klass, Long>, JpaSpecificationExecutor {
    /**
     * 综合查询
     * @param name containing 班级名称
     * @param school 学校
     * @param pageable
     * @return
     */
    default Page findAll(String name, School school, @NotNull Pageable pageable) {
        Assert.notNull(pageable, "传入的Pageable不能为null");

        Specification<Klass> specification = KlassSpecs.containingName(name)
                .and(KlassSpecs.belongToSchool(school));
        return this.findAll(specification, pageable);
    }

    default List<Klass> findBySchoolId(School school) {
        Specification<Klass> specification = KlassSpecs.belongToSchool(school);
        return this.findAll(specification);
    }

    List<Klass> findAllByNameContains(String name);

    @Override
    List<Klass> findAll();
}
