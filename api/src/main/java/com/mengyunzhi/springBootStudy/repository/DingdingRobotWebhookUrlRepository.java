package com.mengyunzhi.springBootStudy.repository;

import com.mengyunzhi.springBootStudy.entity.CourseUsers;
import com.mengyunzhi.springBootStudy.entity.DingdingRobotWebhookUrl;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DingdingRobotWebhookUrlRepository extends JpaRepository<DingdingRobotWebhookUrl, Long> {
}
