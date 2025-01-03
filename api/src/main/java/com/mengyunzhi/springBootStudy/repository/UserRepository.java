package com.mengyunzhi.springBootStudy.repository;

import com.mengyunzhi.springBootStudy.entity.User;
import org.springframework.data.repository.CrudRepository;

/**
 * 用户仓库
 */
public interface UserRepository extends CrudRepository<User, Long> {
    /**
     * 查找用户
     * @param username 用户名
     * @return
     */
    User findByUsername(String username);
}
