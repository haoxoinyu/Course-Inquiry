package com.mengyunzhi.springBootStudy.controller;

import com.mengyunzhi.springBootStudy.entity.UnbusyStudentsOfCurrentWeek;
import com.mengyunzhi.springBootStudy.service.DingdingSendCurrentScheduleService;
import com.mengyunzhi.springBootStudy.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping(produces = "text/html; charset=UTF-8", value = "/DingdingsendCurrentSchedule")
public class DingdingsendCurrentSchedule {
    @Autowired
    ScheduleService scheduleService;

    @Autowired
    DingdingSendCurrentScheduleService dingdingSendCurrentScheduleService;

    /**
     * 编辑查看信息
     * */
    @GetMapping("/getMessage")
    public void generateMessage() {
        // 生成链接
        String scheduleLink = "http://119.132.169.197:8080/DingdingsendCurrentSchedule/sendCurrentSchedule" ;
        String message = String.format("### 今日行程表\n点击链接查看具体行程表：[查看行程表](%s)!", scheduleLink);
        this.dingdingSendCurrentScheduleService.sendMessage(message);
    }

    @GetMapping("/sendCurrentSchedule")
    public String sendCurrentSchedule() {
        //当前时间的时间戳
        long timestamp = System.currentTimeMillis();
        Date date = new Date(timestamp);
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        //转化为字符串
        String dateString = dateFormat.format(date);
        List<UnbusyStudentsOfCurrentWeek> unbusyStudentsOfCurrentWeekList = this.scheduleService.getUnbusyStudentsOfCurrentWeek(dateString);

        List<String> weekdays = Arrays.asList("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday");
        List<String> periods = Arrays.asList( "8:30 - 10:05", "10:25 - 12:00", "14:00 - 15:35", "15:55 - 17:30", "18:40 - 21:00");

        //构造课程表的二维数组
        Map<String, Map<String, String>> schedule = new HashMap<>();
        weekdays.forEach(weekday -> {
            Map<String, String> timeMap = new HashMap<>();
            periods.forEach(period -> {
                timeMap.put(period, "");
            });
            schedule.put(weekday, timeMap);
        });

        //填充schedule
       unbusyStudentsOfCurrentWeekList.forEach(unbusyStudentsOfCurrentWeek -> {
           //拆分为两个时间段一第个元素为星期数，第二个为节数
           String[] timeSplit = parseTimeEntry(unbusyStudentsOfCurrentWeek);
           Map<String, String> periodsOfWeek = schedule.get(weekdays.get(Integer.parseInt(timeSplit[0]) - 1));
           String students = periodsOfWeek.get(periods.get(Integer.parseInt(timeSplit[1]) -1));
           if(students.isEmpty()) {
               periodsOfWeek.put(periods.get(Integer.parseInt(timeSplit[1]) - 1), unbusyStudentsOfCurrentWeek.getUser().getName());
           }else {
               periodsOfWeek.put(periods.get(Integer.parseInt(timeSplit[1]) - 1), students + "<br>" + unbusyStudentsOfCurrentWeek.getUser().getName());
           }
       });

        // 生成 HTML 表格
        StringBuilder tableHtml = new StringBuilder("<!DOCTYPE html> <html lang=\"zh-CN\"> <head> <meta charset=\"UTF-8\"> <title>我的表格</title> </head> <body> <table border=\"1\">");
        tableHtml.append("<tr><th></th>");

        // 生成星期标题行
        weekdays.forEach(weekday -> {
            tableHtml.append(String.format("<th>%s</th>", weekday));
        });
        tableHtml.append("</tr>");
        // 生成表格主体
        periods.forEach(period -> {
            tableHtml.append("<tr>");
            tableHtml.append(String.format("<td> %s </td>", period));
            weekdays.forEach(weekday -> {
                tableHtml.append(String.format("<td> %s </td>", schedule.get(weekday).get(period)));
            });
            tableHtml.append("</tr>");
        });
        tableHtml.append("</body> </html>");
        return tableHtml.toString();
    }

    /**
     * 解析时间条目字符串，返回包含星期几和时间段的数组。
     * @param entry 包含time字段的映射
     * @return 包含星期几和时间段的字符串数组
     */
    public static String[] parseTimeEntry(UnbusyStudentsOfCurrentWeek entry) {
        // 从entry中获取time字段的值
        String time = entry.getTime();
        // 使用"-"作为分隔符来分割字符串
        String[] parts = time.split("-");
        // 返回分割后的结果
        return parts;
    }
}
