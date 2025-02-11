package com.mengyunzhi.springBootStudy.service;

import com.mengyunzhi.springBootStudy.entity.DingdingRobotWebhookUrl;
import com.mengyunzhi.springBootStudy.repository.DingdingRobotWebhookUrlRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DingdingSendCurrentScheduleImpl implements DingdingSendCurrentScheduleService{

    @Autowired
    DingdingRobotWebhookUrlRepository dingdingRobotWebhookUrlRepository;
    public void sendMessage(String message) {
        List< DingdingRobotWebhookUrl> allWebhookUrls = this.dingdingRobotWebhookUrlRepository.findAll();
        //响应体信息
        Map<String, Object> messageData = new HashMap<>();
        messageData.put("msgtype", "markdown");
        Map<String, String> markdown = new HashMap<>();
        markdown.put("title", "新消息通知");
        markdown.put("text", message);
        messageData.put("markdown", markdown);
        //执行请求
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        allWebhookUrls.forEach(webhookUrl -> {
            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(messageData, headers);
            ResponseEntity<String> response = new RestTemplate().exchange(
                    webhookUrl.getWebhookUrl(),
                    HttpMethod.POST,
                    requestEntity,
                    String.class
            );
            if (response.getStatusCode().is2xxSuccessful()) {
                // 处理成功响应
                System.out.println("Success: Message sent to DingTalk.");
            } else {
                // 处理错误响应
                System.out.println("error: Message cannot sent to DingTalk.");
            }
        });

    }



}
