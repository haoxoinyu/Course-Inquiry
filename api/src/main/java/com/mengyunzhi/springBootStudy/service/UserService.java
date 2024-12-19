package com.mengyunzhi.springBootStudy.service;

import com.mengyunzhi.springBootStudy.entity.School;
import com.mengyunzhi.springBootStudy.entity.User;

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
    boolean login(String username, String password);

    /**
     * 验证密码的有效性
     * @param user 用户
     * @param password 密码
     * @return 有效 true
     */
    boolean validatePassword(User user, String password);

    /**
     * 用户注销
     * 系统可以根据HttpServletRequest获取到header中的令牌令牌
     * 所以注销方法不需要传入任何参数
     */
    void logout();

    /**
     * 我是谁
     * @return 当前登录用户。用户未登录则返回null
     */
    User me();

    /**
     * 更新用户
     * @param id ID
     * @param user 更新的用户信息
     * @return 用户
     */
    User update(Long id, User user);
}

