package com.mengyunzhi.springBootStudy.controller;

import com.mengyunzhi.springBootStudy.entity.Klass;
import com.mengyunzhi.springBootStudy.entity.User;
import com.mengyunzhi.springBootStudy.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowCallbackHandler;
import org.springframework.web.bind.annotation.*;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("User")
public class UserController {
    private final static Logger logger = LoggerFactory.getLogger(UserController.class.getName());

    @Autowired
    JdbcTemplate jdbcTemplate;

    @Autowired
    UserService userService;

    @PostMapping("login")
    @CrossOrigin("*")
    public ResponseEntity<Map<String, Object>> login(@RequestBody User user) {
        return this.userService.login(user.getUsername(), user.getPassword());
    }

    @GetMapping("logout")
    public void login() {
        this.userService.logout();
    }

    @GetMapping("me")
    public User me() {
        System.out.println("用户成功的请求了me方法");
        return this.userService.me();
    }

    @DeleteMapping("{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseEntity<Map<String, Object>> delete(@PathVariable Long id) {
        return userService.deleteById(id);
    }

    @GetMapping
    @CrossOrigin("*")
    public Page<User> findAll(
            @RequestParam String username,
            @RequestParam Long klassId,
            @RequestParam Long role,
            @RequestParam Long state,
            @RequestParam int page,
            @RequestParam int size) {
        return this.userService.findAll(
                username,
                klassId,
                role,
                state,
                PageRequest.of(page, size));
    }

    /**
     * 根据ID获取数据表中的用户数据并返回，用于查询某个用户的数据
     * 虽然在学习的过程中，我们将方法中的每条语句都加入注释会有利于我们的理解。
     * 但在生产的环境中，我们并不推荐在方法体中加入注释。
     * 我们认为：
     * 1 每个方法都应该是足够短小的。
     * 2 每个方法的注释都是可以在方法头部说明的。
     * 3 在代码输写时，我们更注重的是业务逻辑层面的交流而非coding方法的交流。
     * 如果我们认为方法中的代码的确是需要注释的（比如一些新的方法、新的思想的引入，我们想其它的成员能够快速的学习到该技巧）
     * 那么应该该代码段抽离出来，变成一个新的方法，然后在该方法上加入注释。
     *
     * @param id 用户ID
     * @return
     */
    @GetMapping("{id}")
    @CrossOrigin("*")
    public User getById(@PathVariable Long id) {
        return this.userService.getById(id);
    }


    /**
     * 新增用户
     * 1. 获取前台传入的用户对象
     * 2. 拼接插入sql语句
     * 3. 执行sql语句。
     *
     * @param user 用户
     */
    @PostMapping
    @CrossOrigin("*")
    public ResponseEntity<Map<String, Object>> save(@RequestBody User user) {
        return this.userService.save(user);
    }

    /**
     * 使用传入的数据更新某个用户的数据
     *
     * @param id   用户ID
     * @param user 更新用户
     * @return
     */
    @PutMapping("{id}")
    @CrossOrigin("*")
    public ResponseEntity<Map<String, Object>> update(@PathVariable Long id, @RequestBody User user) {
        return this.userService.update(id, user);
    }

    /**
     * 通过klassId获取相关用户
     *
     * **/
    @GetMapping("/getUsersByKlassId")
    @CrossOrigin("*")
    public List<User> getUsersByKlassId(@RequestParam Long klassId) {
        return this.userService.findByKlassId(klassId);

    }
}