package com.mengyunzhi.springBootStudy.service;

import java.util.Map;

public interface DingdingSendCurrentScheduleService {
    public void sendMessage(String message);

    public void sendMessage(String message, String webhookUrl);

}
