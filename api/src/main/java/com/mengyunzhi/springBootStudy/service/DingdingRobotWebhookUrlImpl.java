package com.mengyunzhi.springBootStudy.service;

import com.mengyunzhi.springBootStudy.entity.DingdingRobotWebhookUrl;
import com.mengyunzhi.springBootStudy.repository.DingdingRobotWebhookUrlRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DingdingRobotWebhookUrlImpl implements DingdingRobotWebhookUrlService{

    @Autowired
    DingdingRobotWebhookUrlRepository dingdingRobotWebhookUrlRepository;

    @Override
    public void addWebhookUrl(String webhookUrl) {
        DingdingRobotWebhookUrl robot = new DingdingRobotWebhookUrl();
        robot.setWebhookUrl(webhookUrl);
        this.dingdingRobotWebhookUrlRepository.save(robot);
    }
}
