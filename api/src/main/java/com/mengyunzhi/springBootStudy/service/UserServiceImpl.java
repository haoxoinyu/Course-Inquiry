package com.mengyunzhi.springBootStudy.service;

import com.mengyunzhi.springBootStudy.entity.CourseUsers;
import com.mengyunzhi.springBootStudy.entity.Klass;
import com.mengyunzhi.springBootStudy.entity.User;
import com.mengyunzhi.springBootStudy.filter.TokenFilter;
import com.mengyunzhi.springBootStudy.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.servlet.http.HttpServletRequest;
import javax.validation.constraints.NotNull;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {
    private final static Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);
    /** auth-token与userId的映射 */
    private HashMap<String, Long> authTokenUserIdHashMap = new HashMap<>();

    private final HttpServletRequest request;

    private UserRepository userRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    CourseUserService courseUserService;

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
    public ResponseEntity<Map<String, Object>> login(String username, String password) {
        Map<String, Object> response = new HashMap<>();
        User user = this.userRepository.findByUsername(username);
        if (!this.validatePassword(user, password)) {
            // 认证不成功直接返回
            response.put("status", "error");
            response.put("message", "用户名或密码不正确");
            return ResponseEntity.ok(response);
        }
        if (!this.validateState(user)) {
            // 认证不成功直接返回
            response.put("status", "error");
            response.put("message", "用户已被冻结");
            return ResponseEntity.ok(response);
        }

        // 认证成功，进行auth-token与userId的绑定绑定
        String authToken = this.request.getHeader("auth-token");
        logger.info("获取到的auth-token为" + authToken);
        this.authTokenUserIdHashMap.put(authToken, user.getId());

        response.put("status", "success");
        response.put("message", "登录成功");
        response.put("userId", user.getId());
        response.put("authToken", authToken);

        return ResponseEntity.ok(response);
    }

    @Override
    public boolean validatePassword(User user, String password) {
        if (user == null || user.getPassword() == null || password == null) {
            return false;
        }

        return user.getPassword().equals(password);
    }

    @Override
    public boolean validateState(User user) {
        if (user == null || user.getPassword() == null) {
            return false;
        }

        return user.getState().equals(1L);
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
    public ResponseEntity<Map<String, Object>> update(Long id, User user) {

        User oldUser = this.userRepository.findById(id).get();

        Map<String, Object> response = new HashMap<>();

        if(!this.validateUser(user)){
            response.put("status", "error");
            response.put("message", "该用户已存在");
            return ResponseEntity.ok(response);
        } else {
            this.updateFields(user,oldUser);
            response.put("status", "success");
            response.put("message", "编辑成功");
            return ResponseEntity.ok(response);
        }
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
    public ResponseEntity<Map<String, Object>> save(User user) {
        Map<String, Object> response = new HashMap<>();

        if(!this.validateUser(user)){
            response.put("status", "error");
            response.put("message", "该用户已存在");
            return ResponseEntity.ok(response);
        } else {
            this.userRepository.save(user);
            response.put("status", "success");
            response.put("message", "新增成功");
            return ResponseEntity.ok(response);
        }
    }

    @Override
    public boolean validateUser(User user) {
        // 使用数据库查询，验证是否已经存在相同的User
        String hql = "FROM User u WHERE u.username = :username";
        List<User> result = entityManager.createQuery(hql, User.class)
                .setParameter("username", user.getUsername())
                .getResultList();

        // 如果查询结果为空，则表示没有重复的用户名，返回true
        if (result.isEmpty()) {
            return true;
        }

        // 如果查询到一条数据且userId相同，则返回true
        if (result.size() == 1) {
            User existingUser = result.get(0);
            return existingUser.getId().equals(user.getId());
        }

        // 如果查询到多条数据或userId不同，则返回false
        return false;
    }

    @Override
    public ResponseEntity<Map<String, Object>> deleteById(Long id) {
        Map<String, Object> response = new HashMap<>();

        User user = this.userRepository.findById(id).get();

        // 检查班级是否有用户
        List<CourseUsers> courseUserList = this.courseUserService.findByUserId(user.getId());
        if (!courseUserList.isEmpty()) {
            for (CourseUsers courseUsers : courseUserList) {
                this.courseUserService.deleteCourseUser(courseUsers.getId().getCourseId(), courseUsers.getId().getUserId());
            }
        }

        // 如果用户已经清空，删除班级
        this.userRepository.deleteById(id);
        response.put("status", "success");
        response.put("message", "删除成功");
        return ResponseEntity.ok(response);
    }

    @Override
    public List<User> findByKlassId(Long klassId) {
        Klass klass = new Klass();
        klass.setId(klassId);
        return this.userRepository.findByKlass(klass);
    }

    @Override
    public List<User> getAll() {
        return this.userRepository.findAll();
    }
 }

