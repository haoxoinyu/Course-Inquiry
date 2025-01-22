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
    public void delete(@PathVariable Long id) {
        userService.deleteById(id);
    }

//    @GetMapping
//    @CrossOrigin("*")
//    public List<User> getAll() {
//        logger.info("调用UserController的getAll方法");
//        /*初始化不固定大小的数组*/
//        List<User> users = new ArrayList<>();
//
//        /* 定义实现了RowCallbackHandler接口的对象*/
//        RowCallbackHandler rowCallbackHandler = new RowCallbackHandler() {
//            /**
//             * 该方法用于执行jdbcTemplate.query后的回调，每行数据回调1次。比如User表中有两行数据，则回调此方法两次。
//             *
//             * @param resultSet 查询结果，每次一行
//             * @throws SQLException 查询出错时，将抛出此异常，暂时不处理。
//             */
//            @Override
//            public void processRow(ResultSet resultSet) throws SQLException {
//                User user = new User();
//                /*获取字段id，并转换为Long类型返回*/
//                user.setId(resultSet.getLong("id"));
//                /*获取字段name，并转换为String类型返回*/
//                user.setName(resultSet.getString("name"));
//                /*获取字段sex，并转换为布尔类型返回*/
//                user.setSex(resultSet.getBoolean("sex"));
//                user.setUsername(resultSet.getString("username"));
//                user.setRole(resultSet.getLong("role"));
//                user.setState(resultSet.getLong("state"));
//
//                /*将得到的user添加到要返回的数组中*/
//                users.add(user);
//            }
//        };
//
//        /*定义查询字符串*/
//        String query = "select id, name, sex, username, role, state from user";
//
//        /*使用query进行查询，并把查询的结果通过调用rowCallbackHandler.processRow()方法传递给rowCallbackHandler对象*/
//        jdbcTemplate.query(query, rowCallbackHandler);
//        return users;
//    }

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
    public void save(@RequestBody User user) {
        this.userService.save(user);
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
    public User update(@PathVariable Long id, @RequestBody User user) {
        System.out.println(id);
        System.out.println(user);
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