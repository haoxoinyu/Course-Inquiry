package com.mengyunzhi.springBootStudy.service;

import com.mengyunzhi.springBootStudy.entity.Course;
import com.mengyunzhi.springBootStudy.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

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
        courseRepository.save(oldCourse);
    }

}
