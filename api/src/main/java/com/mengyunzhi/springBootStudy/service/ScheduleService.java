package com.mengyunzhi.springBootStudy.service;

public interface ScheduleService {
    /**
     * 将字符串转化为对应星期的星期一的时间戳
     * @param date 时间字符串
     * */
    public Long changeToMonday(String date);
}
