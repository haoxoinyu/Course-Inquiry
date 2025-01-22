package com.mengyunzhi.springBootStudy.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.mengyunzhi.springBootStudy.service.ScheduleService;
@RestController
@RequestMapping("Schedule")
public class ScheduleController {

    @Autowired
    private ScheduleService scheduleService;


    @GetMapping("getfirstDayOfCurrentWeek")
    public Long getfirstDayOfCurrentWeek(@RequestParam String date) {
        return this.scheduleService.changeToMonday(date);
    }
}
