package com.mengyunzhi.springBootStudy.service;

import com.mengyunzhi.springBootStudy.entity.UnbusyStudentsOfCurrentWeek;
import com.mengyunzhi.springBootStudy.entity.User;

import java.util.List;

public interface ScheduleService {

    /***
     * 获取空闲学生名单
     * @param date 查询日期
     * */
    public List<UnbusyStudentsOfCurrentWeek> getUnbusyStudentsOfCurrentWeek(String date);
}
