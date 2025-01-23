package com.mengyunzhi.springBootStudy.controller;

import com.mengyunzhi.springBootStudy.entity.UnbusyStudentsOfCurrentWeek;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.mengyunzhi.springBootStudy.service.ScheduleService;

import java.util.List;

@RestController
@RequestMapping("Schedule")
public class ScheduleController {

    @Autowired
    private ScheduleService scheduleService;


    @GetMapping("getfirstDayOfCurrentWeek")
    public Long getfirstDayOfCurrentWeek(@RequestParam String date) {
        return this.scheduleService.changeToMonday(date);
    }

    @GetMapping("getUnbusyStudentsOfCurrentWeek")
    public List<UnbusyStudentsOfCurrentWeek> getUnbusyStudentsOfCurrentWeek(@RequestParam String date) {
        return this.scheduleService.getUnbusyStudentsOfCurrentWeek(date);
    }

}
