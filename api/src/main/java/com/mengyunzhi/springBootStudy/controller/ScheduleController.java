package com.mengyunzhi.springBootStudy.controller;

import com.mengyunzhi.springBootStudy.entity.UnbusyStudentsOfCurrentWeek;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.mengyunzhi.springBootStudy.service.ScheduleService;

import java.util.List;

@RestController
@RequestMapping("Schedule")
public class ScheduleController {

    @Autowired
    private ScheduleService scheduleService;


    @GetMapping("getfirstDayOfCurrentWeek")
    @CrossOrigin("*")
    public Long getfirstDayOfCurrentWeek(@RequestParam String date) {
        return this.scheduleService.changeToMonday(date);
    }

    @GetMapping("getUnbusyStudentsOfCurrentWeek")
    @CrossOrigin("*")
    public List<UnbusyStudentsOfCurrentWeek> getUnbusyStudentsOfCurrentWeek(@RequestParam String date) {
        return this.scheduleService.getUnbusyStudentsOfCurrentWeek(date);
    }

}
