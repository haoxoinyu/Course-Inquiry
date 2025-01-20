package com.mengyunzhi.springBootStudy.service;

import com.mengyunzhi.springBootStudy.entity.Klass;
import com.mengyunzhi.springBootStudy.entity.User;
import com.mengyunzhi.springBootStudy.filter.TokenFilter;
import com.mengyunzhi.springBootStudy.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import javax.servlet.http.HttpServletRequest;
import javax.validation.constraints.NotNull;
import java.util.HashMap;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {
    private final static Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);
    /** auth-token与userId的映射 */
    private HashMap<String, Long> authTokenUserIdHashMap = new HashMap<>();

    private final HttpServletRequest request;

    private UserRepository userRepository;

    @Autowired
    public UserServiceImpl(HttpServletRequest request, UserRepository userRepository) {
        this.request = request;
        this.userRepository = userRepository;
    }

    @Override
    public boolean isLogin(String authToken) {
        // 获取authToken映射的userId
        Long userId = this.authTokenUserIdHashMap.get(authToken);
        return userId != null;
    }

    @Override
    public boolean login(String username, String password) {
        User user = this.userRepository.findByUsername(username);
        if (!this.validatePassword(user, password)) {
            // 认证不成功直接返回
            return false;
        }

        // 认证成功，进行auth-token与userId的绑定绑定
        logger.info("获取到的auth-token为" + this.request.getHeader("auth-token"));
        this.authTokenUserIdHashMap.put(this.request.getHeader("auth-token"), user.getId());
        return true;
    }

    @Override
    public boolean validatePassword(User user, String password) {
        if (user == null || user.getPassword() == null || password == null) {
            return false;
        }

        return user.getPassword().equals(password);
    }

    @Override
    public void logout() {
        // 获取auth-token
        String authToken = this.request.getHeader("auth-token");
        logger.info("获取到的auth-token为" + this.request.getHeader("auth-token"));

        // 删除hashMap中对应auth-token的映射
        this.authTokenUserIdHashMap.remove(authToken);
    }

    @Override
    public User me() {
        // 获取authToken
        String authToken = this.request.getHeader(TokenFilter.TOKEN_KEY);

        // 获取authToken映射的userId
        Long userId = this.authTokenUserIdHashMap.get(authToken);
        if (userId == null) {
            // 未获取到userId，说明该auth-token未与用户进行绑定，返回null
            return null;
        }

        // 如获取到userId，则由数据库中获取user并返回
        Optional<User> userOptional = this.userRepository.findById(userId);
        return userOptional.get();
    }

    @Override
    public Page<User> findAll(String username, Long klassId, Long role, Long state, @NotNull Pageable pageable) {
        Assert.notNull(pageable, "Pageable不能为null");

        Klass klass = new Klass();
        klass.setId(klassId);

        return this.userRepository.findAll(username, klass, role, state, pageable);
    }

    /**
     * 获取某个用户
     *
     * @param id 用户ID
     * @return 用户
     */
    @Override
    public User getById(Long id) {
        return this.userRepository.findById(id).get();
    }

    @Override
    public User update(Long id, User user) {
        User oldUser = this.userRepository.findById(id).get();
        System.out.println(oldUser);
        return this.updateFields(user,oldUser);
    }

    /**
     * 更新学生
     * @param newUser 新用户信息
     * @param oldUser 老用户信息
     * @return 更新后的用户信息
     */
    public User updateFields(User newUser, User oldUser) {
        oldUser.setName(newUser.getName());
        oldUser.setUsername(newUser.getUsername());
        oldUser.setPassword(newUser.getPassword());
        oldUser.setSex(newUser.getSex());
        oldUser.setRole(newUser.getRole());
        oldUser.setState(newUser.getState());
        oldUser.setKlass(newUser.getKlass());
        return this.userRepository.save(oldUser);
    }

    @Override
    public void save(User user) {
        this.userRepository.save(user);
    }

    @Override
    public void deleteById(Long id) {
        this.userRepository.deleteById(id);
    }
}

