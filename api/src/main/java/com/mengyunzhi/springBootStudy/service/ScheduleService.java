package com.mengyunzhi.springBootStudy.service;

import com.mengyunzhi.springBootStudy.entity.UnbusyStudentsOfCurrentWeek;
import com.mengyunzhi.springBootStudy.entity.User;

import java.util.List;

public interface ScheduleService {
    /**
     * 将字符串转化为对应星期的星期一的时间戳
     * @param date 时间字符串
     * */
    public Long changeToMonday(String date);

    /***
     * 获取空闲学生名单
     * @param date 查询日期
     * */
    public List<UnbusyStudentsOfCurrentWeek> getUnbusyStudentsOfCurrentWeek(String date);
}
