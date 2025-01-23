package com.mengyunzhi.springBootStudy.service;

import com.mengyunzhi.springBootStudy.entity.Klass;
import com.mengyunzhi.springBootStudy.entity.School;
import com.mengyunzhi.springBootStudy.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import javax.validation.constraints.NotNull;

import java.util.List;
import java.util.Map;

/**
 * 用户
 * @author 梦云智
 */
public interface UserService {
    /**
     * 判断用户是否登录
     * @param authToken 认证令牌
     * @return
     */
    boolean isLogin(String authToken);


    /**
     * 用户登录
     * @param username 用户名
     * @param password 密码
     * @return 成功 true
     */
    ResponseEntity<Map<String, Object>> login(String username, String password);

    /**
     * 验证密码的有效性
     * @param user 用户
     * @param password 密码
     * @return 有效 true
     */
    boolean validatePassword(User user, String password);

    /**
     * 验证用户状态
     * @param user
     * @return
     */
    boolean validateState(User user);

    /**
     * 用户注销
     * 系统可以根据HttpServletRequest获取到header中的令牌令牌
     * 所以注销方法不需要传入任何参数
     */
    void logout();

    /**
     * 删除
     *
     * @param id ID
     */
    ResponseEntity<Map<String, Object>> deleteById(Long id);

    /**
     * 我是谁
     * @return 当前登录用户。用户未登录则返回null
     */
    User me();

    /**
     * 综合查询
     *
     * @param username
     * @param klassId
     * @param role
     * @param state
     * @param pageable
     * @return
     */
    Page<User> findAll(String username, Long klassId, Long role, Long state, @NotNull Pageable pageable);

    /**
     * 新增
     *
     * @param user 用户
     */
    ResponseEntity<Map<String, Object>> save(User user);

    /**
     * 验证
     */
    boolean validateUser(@NotNull User user);

    /**
     * 通过ID获取用户
     *
     * @param id 用户ID
     * @return 用户实体
     */
    User getById(Long id);

    /**
     * 更新用户
     * @param id ID
     * @param user 更新的用户信息
     * @return 用户
     */
    ResponseEntity<Map<String, Object>> update(Long id, User user);

    List<User> findByKlassId(Long klassId);
}

