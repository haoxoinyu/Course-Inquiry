package com.mengyunzhi.springBootStudy.entity;

import javax.persistence.*;
@Entity
@Table(name = "course_users")
public class CourseUsers {

    @EmbeddedId
    private CourseUserId id;

    @ManyToOne
    @MapsId("courseId") // 映射复合主键中的 courseId 字段
    @JoinColumn(name = "course_id", referencedColumnName = "id")
    private Course course;

    @ManyToOne
    @MapsId("userId") // 映射复合主键中的 userId 字段
    @JoinColumn(name = "users_id", referencedColumnName = "id")
    private User user;

    // 默认构造函数（JPA 必须）
    public CourseUsers() {
    }

    // Getters 和 Setters
    public CourseUserId getId() {
        return id;
    }

    public void setId(CourseUserId id) {
        this.id = id;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @Override
    public String toString() {
        return "CourseUser{" +
                "id=" + id +
                ", course=" + course +
                ", user=" + user +
                '}';
    }
}