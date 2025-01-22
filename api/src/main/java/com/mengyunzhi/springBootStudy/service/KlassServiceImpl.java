package com.mengyunzhi.springBootStudy.service;

import com.mengyunzhi.springBootStudy.entity.Klass;
import com.mengyunzhi.springBootStudy.entity.School;
import com.mengyunzhi.springBootStudy.entity.Term;
import com.mengyunzhi.springBootStudy.entity.User;
import com.mengyunzhi.springBootStudy.repository.KlassRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.validation.constraints.NotNull;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 班级服务实现
 */
@Service
public class KlassServiceImpl implements KlassService {
    /*班级仓库*/
    @Autowired
    KlassRepository klassRepository;

    @Autowired
    UserService userService;

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public ResponseEntity<Map<String, Object>> deleteById(Long id) {
        Map<String, Object> response = new HashMap<>();

        Klass klass = this.klassRepository.findById(id).get();

        // 检查班级是否有用户
        List<User> userList = this.userService.findByKlassId(klass.getId());
        if (!userList.isEmpty()) {
            response.put("status", "error");
            response.put("message", "该班级仍有用户未清空");
            return ResponseEntity.ok(response);
        }

        // 如果用户已经清空，删除班级
        this.klassRepository.deleteById(id);
        response.put("status", "success");
        response.put("message", "删除成功");
        return ResponseEntity.ok(response);

    }

    @Override
    public List<Klass> getAll() {
        return this.klassRepository.findAll();
    }

    @Override
    public Page<Klass> findAll(Pageable pageable) {
        return this.klassRepository.findAll(pageable);
    }

    @Override
    public List<Klass> getKlassBySchool(School school) {
        return this.klassRepository.findBySchoolId(school);
    }

    @Override
    public Page<Klass> findAll(String name, Long schoolId, @NotNull Pageable pageable) {
        Assert.notNull(pageable, "Pageable不能为null");

        School school = new School();
        school.setId(schoolId);

        return this.klassRepository.findAll(name, school, pageable);
    }

    /**
     * 获取某个班级
     *
     * @param id 班级ID
     * @return 班级
     */
    @Override
    public Klass getById(Long id) {
        return this.klassRepository.findById(id).get();
    }

    @Override
    public ResponseEntity<Map<String, Object>> save(Klass klass) {
        Map<String, Object> response = new HashMap<>();

        if(!this.validateKlass(klass)){
            response.put("status", "error");
            response.put("message", "该班级已存在");
            return ResponseEntity.ok(response);
        } else {
            this.klassRepository.save(klass);
            response.put("status", "success");
            response.put("message", "新增成功");
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 更新班级
     * 获取数据库中的老数据
     * 使用传入的新数据对老数据的更新字段赋值
     * 将更新后的老数据重新保存在数据表中
     *
     * @param id    要更新的班级ID
     * @param klass 新班级数据
     */
    @Override
    public ResponseEntity<Map<String, Object>> update(Long id, Klass klass) {
        Klass oldKlass = this.klassRepository.findById(id).get();

        Map<String, Object> response = new HashMap<>();

        if(!this.validateKlass(klass)){
            response.put("status", "error");
            response.put("message", "该班级已存在");
            return ResponseEntity.ok(response);
        } else {
            oldKlass.setName(klass.getName());
            oldKlass.setSchool(klass.getSchool());
            klassRepository.save(oldKlass);
            response.put("status", "success");
            response.put("message", "编辑成功");
            return ResponseEntity.ok(response);
        }
    }

    @Override
    public boolean validateKlass(Klass klass) {
        // 使用数据库查询，验证是否已经存在相同的Klass
        String hql = "FROM Klass k WHERE k.name = :name AND k.school.id = :schoolId";
        List<Klass> result = entityManager.createQuery(hql, Klass.class)
                .setParameter("name", klass.getName())
                .setParameter("schoolId", klass.getSchool().getId())
                .getResultList();

        // 如果查询结果不为空，则表示数据库中已经存在相同的Klass
        return result.isEmpty();
    }
}
