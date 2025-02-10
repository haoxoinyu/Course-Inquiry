package com.mengyunzhi.springBootStudy.service;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import java.util.Map;

@Service
public class DingdingSendCurrentScheduleImpl implements DingdingSendCurrentScheduleService{

    public void sendMessage(String message) {
        String webhookUrl = "https://oapi.dingtalk.com/robot/send?access_token=85c6d929ffb5e7558b938a38b4f2f315536de04924189f4ea13ce11d7e86dfbc";
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
        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(messageData, headers);
        ResponseEntity<String> response = new RestTemplate().exchange(
                webhookUrl,
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
    }



}
