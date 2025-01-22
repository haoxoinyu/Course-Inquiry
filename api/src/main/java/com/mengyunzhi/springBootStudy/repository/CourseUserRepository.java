package com.mengyunzhi.springBootStudy.repository;

import com.mengyunzhi.springBootStudy.entity.CourseUser;
import com.mengyunzhi.springBootStudy.entity.CourseUserId;
import com.mengyunzhi.springBootStudy.entity.Klass;
import com.mengyunzhi.springBootStudy.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseUserRepository extends JpaRepository<CourseUser, CourseUserId> {
    List<CourseUser> findByUser(User user);
}
