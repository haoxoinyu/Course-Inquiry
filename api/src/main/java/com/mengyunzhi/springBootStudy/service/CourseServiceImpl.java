package com.mengyunzhi.springBootStudy.service;

import com.mengyunzhi.springBootStudy.entity.*;
import com.mengyunzhi.springBootStudy.repository.CourseRepository;
import com.mengyunzhi.springBootStudy.repository.KlassRepository;
import com.mengyunzhi.springBootStudy.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.function.Predicate;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
@Service
public class CourseServiceImpl implements CourseService {
    private CourseRepository courseRepository;
    private UserRepository userRepository;
    private KlassRepository klassRepository;
    Map<String, Object> response = new HashMap<>();

    @Autowired
    public CourseServiceImpl(CourseRepository courseRepository, UserRepository userRepository, KlassRepository klassRepository) {
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
        this.klassRepository = klassRepository;
    }

    @Override
    public ResponseEntity<Map<String, Object>> save(Course course) {
            if(course.getSory() == 1L) {
                Optional<User> user = this.userRepository.findById(course.getUsers().get(0).getId());
                Optional<Klass> klass = this.klassRepository.findById(user.get().getKlass().getId());
                List<User> userList = new ArrayList<>();
                List<User> allUSer = java.util.stream.StreamSupport.stream(this.userRepository.findAll().spliterator(), false)
                        .collect(Collectors.toList());
                for(User user1 : allUSer) {
                    if(user1.getKlass().getId() == user.get().getId()) {
                        userList.add(user1);
                    }
                }
                //全部检查是否全班已经有人这个时间段有课
                for(User inneruser : userList) {
                    User newuser = new User();
                    newuser.setId(inneruser.getId());
                    List<User> userContain = new ArrayList<>();
                    userContain.add(newuser);
                    course.setUsers(userContain);
                    if(!this.checkTheSameCourse(course)) {
                        response.put("status", "error");
                        response.put("message", "该班级已经有学生这个时间段已经有课");
                        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
                    };
                }
                //加课
                for(User inneruser : userList) {
                    User newuser = new User();
                    newuser.setId(inneruser.getId());
                    List<User> userContain = new ArrayList<>();
                    userContain.add(newuser);
                    course.setUsers(userContain);
                    this.courseRepository.save(course);
                }
                response.put("status", "success");
                response.put("message", "添加成功");
            }else {
                if(!this.checkTheSameCourse(course)) {
                    response.put("message", "该学生这个时间段已经有课");
                    return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
                }else {
                    this.courseRepository.save(course);
                    response.put("status", "success");
                    response.put("message", "添加成功");
                }
            }
            return ResponseEntity.ok(response);
    }

    @Override
    public boolean existsByName(String name) {
        return this.courseRepository.existsByName(name);
    }

    @Override
    public void deleteById(Long id) {
        this.courseRepository.deleteById(id);
    }

    @Override
    public List<Course> getAll(String name) {
        return this.courseRepository.findAllByNameContains(name);
    }


    /**
     * 获取某个班级
     *
     * @param id 班级ID
     * @return 班级
     */
    @Override
    public Course getById(Long id) {
        return this.courseRepository.findById(id).get();
    }

    /**
     * 更新班级
     * 获取数据库中的老数据
     * 使用传入的新数据对老数据的更新字段赋值
     * 将更新后的老数据重新保存在数据表中
     *
     * @param id    要更新的班级ID
     * @param course 新班级数据
     */
    @Override
    public ResponseEntity<Map<String, Object>> update(Long id, Course course) {
        Course oldCourse = courseRepository.findById(id).get();
        oldCourse.setName(course.getName());
        oldCourse.setTerm(course.getTerm());
        oldCourse.setDay(course.getDay());
        oldCourse.setSory(course.getSory());
        oldCourse.setWeek(course.getWeek());
        oldCourse.setUsers(course.getUsers());
        oldCourse.setPeriod(course.getPeriod());

        if(course.getSory() == 1L) {
            //获取全班同学
            Optional<User> user = this.userRepository.findById(course.getUsers().get(0).getId());
            Optional<Klass> klass = this.klassRepository.findById(user.get().getKlass().getId());
            List<User> userList = new ArrayList<>();
            List<User> allUSer = java.util.stream.StreamSupport.stream(this.userRepository.findAll().spliterator(), false)
                    .collect(Collectors.toList());
            for(User user1 : allUSer) {
                if(user1.getKlass().getId() == user.get().getId()) {
                    userList.add(user1);
                }
            }
            //全部检查是否全班已经有人这个时间段有课
            for(User inneruser : userList) {
                User newuser = new User();
                newuser.setId(inneruser.getId());
                List<User> userContain = new ArrayList<>();
                userContain.add(newuser);
                oldCourse.setUsers(userContain);
                if(!this.checkTheSameCourse(oldCourse)) {
                    response.put("status", "error");
                    response.put("message", "该班级已经有学生这个时间段已经有课");
                    return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
                };
            }
            //加课
            for(User inneruser : userList) {
                User newuser = new User();
                newuser.setId(inneruser.getId());
                List<User> userContain = new ArrayList<>();
                userContain.add(newuser);
                oldCourse.setUsers(userContain);
                this.courseRepository.save(oldCourse);
            }
            response.put("status", "success");
            response.put("message", "更新成功");
        }else {
            if(!this.checkTheSameCourse(oldCourse)) {
                response.put("message", "该学生这个时间段已经有课");
                return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
            }else {
                this.courseRepository.save(oldCourse);
                response.put("status", "success");
                response.put("message", "更新成功");
            }
        }
        return ResponseEntity.ok(response);
    }

    @Override
    public Page<Course> findAll(String name, Long schoolId, Long klassId, Long termId, Long userId, Pageable pageable) {
        System.out.println("service" + termId);
        Klass klass = new Klass();
        klass.setId(klassId);
        System.out.println("service klassId: "+ klass.getId());
        School school = new School();
        school.setId(schoolId);
        Term term = new Term();
        term.setId(termId);
        User user = new User();
        user.setId(userId);
        return this.courseRepository.findAll(name, school, klass, term, user, pageable);
    }

    @Override
    public List<Course> findAll(Long schoolId, Long klassId, Long termId, List<Integer> week) {
        School school = new School();
        school.setId(schoolId);
        Klass klass = new Klass();
        klass.setId(klassId);
        Term term = new Term();
        term.setId(termId);
        return courseRepository.findAll(school, klass, term, week);
    }


    @Override
    public Page<Course> findCoursesByCriteria(Long termId, String courseName, Long sory, Long userId, Pageable pageable) {
        Term term = new Term();
        term.setId(termId);

        User user = new User();
        user.setId(userId);
        return courseRepository.find(term, courseName, sory, user, pageable);
    }

    @Override
    public ArrayList<Course> getCoursesByTermId(Long termId, Long sory) {
        return new ArrayList<>(courseRepository.getCoursesByTermId(termId, sory));
    }

    @Override
    public ArrayList<Course> findByTermId(Long termId) {
        return new ArrayList<>(courseRepository.findByTermId(termId));
    }

    @Override
    public Optional<Course> findById(Long courseId) {
        return this.courseRepository.findById(courseId);
    }

    public boolean checkTheSameCourse(Course course) {
        List<Course> allCourse =  this.courseRepository.findByUsers(course.getUsers());
        List<Course> selectCourse =  java.util.stream.StreamSupport.stream(allCourse.spliterator(), false)
                .collect(Collectors.toList()).stream()
                .filter(matchingCourse ->!Collections.disjoint(matchingCourse.getDay(), course.getDay()) &&
                                        !Collections.disjoint(matchingCourse.getWeek(), course.getWeek()) &&
                                        !Collections.disjoint(matchingCourse.getPeriod(), course.getPeriod()))
                .collect(Collectors.toList());
        return selectCourse.isEmpty();
    }
}
