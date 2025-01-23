package com.mengyunzhi.springBootStudy.service;

import com.mengyunzhi.springBootStudy.entity.*;
import com.mengyunzhi.springBootStudy.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Predicate;
import java.util.Optional;

@Service
public class CourseServiceImpl implements CourseService {
    private CourseRepository courseRepository;

    @Autowired
    public CourseServiceImpl(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    @Override
    public Course save(Course course) {
        return this.courseRepository.save(course);
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
    public void update(Long id, Course course) {
        Course oldCourse = courseRepository.findById(id).get();
        oldCourse.setName(course.getName());
        oldCourse.setTerm(course.getTerm());
        oldCourse.setDay(course.getDay());
        oldCourse.setSory(course.getSory());
        oldCourse.setWeek(course.getWeek());
        oldCourse.setUsers(course.getUsers());
        oldCourse.setPeriod(course.getPeriod());
        courseRepository.save(oldCourse);
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
}
