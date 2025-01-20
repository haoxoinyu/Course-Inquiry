package com.mengyunzhi.springBootStudy.entity;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class CourseUserId implements Serializable {

    @Column(name = "course_id")  // 确保列名与数据库中的字段一致
    private Long courseId;

    @Column(name = "users_id")  // 确保列名与数据库中的字段一致
    private Long userId;

    // 默认构造函数
    public CourseUserId() {
    }

    public CourseUserId(Long courseId, Long userId) {
        this.courseId = courseId;
        this.userId = userId;
    }

    // Getters 和 Setters
    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    // 覆盖 equals 和 hashCode 方法，以便 JPA 正确识别复合主键
    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        CourseUserId that = (CourseUserId) o;
        return Objects.equals(courseId, that.courseId) && Objects.equals(userId, that.userId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(courseId, userId);
    }
}