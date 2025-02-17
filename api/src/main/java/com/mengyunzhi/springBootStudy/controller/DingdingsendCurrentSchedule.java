package com.mengyunzhi.springBootStudy.controller;

import com.mengyunzhi.springBootStudy.entity.UnbusyStudentsOfCurrentWeek;
import com.mengyunzhi.springBootStudy.service.DingdingRobotWebhookUrlService;
import com.mengyunzhi.springBootStudy.service.DingdingSendCurrentScheduleService;
import com.mengyunzhi.springBootStudy.service.ScheduleImpl;
import com.mengyunzhi.springBootStudy.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping(produces = "text/html; charset=UTF-8", value = "/DingdingsendCurrentSchedule")
public class DingdingsendCurrentSchedule {
    @Autowired
    ScheduleService scheduleService;

    @Autowired
    DingdingRobotWebhookUrlService dingdingRobotWebhookUrlService;

    @Autowired
    DingdingSendCurrentScheduleService dingdingSendCurrentScheduleService;
    @PostMapping("/add")
    @CrossOrigin("*")
    public ResponseEntity<?> addWebhookUrl(@RequestBody String webhookUrl) {
        try{
            this.dingdingRobotWebhookUrlService.addWebhookUrl(webhookUrl);
            return ResponseEntity.status(HttpStatus.OK).body("{\"message\": \"添加成功\"}");
        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.CONFLICT).body("当前机器人已添加过了，请勿重复添加");
        }
    }

    /**
     * 编辑查看信息
     * */
    @GetMapping("/getMessage")
    @CrossOrigin("*")
    @Scheduled(cron = "0 0 9 * * ?")
    public void generateMessage() {
        // 生成链接
        String scheduleLink = "http://119.132.169.197:8080/DingdingsendCurrentSchedule/sendCurrentSchedule" ;
        String message = String.format("### 今日行程表\n点击链接查看具体行程表：[查看行程表](%s)!", scheduleLink);
        this.dingdingSendCurrentScheduleService.sendMessage(message);
    }

    @GetMapping("/sendCurrentSchedule")
    @CrossOrigin("*")
    public String sendCurrentSchedule() {
        //当前时间的时间戳
        long timestamp = System.currentTimeMillis();
        Date date = new Date(timestamp);
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        //转化为字符串
        String dateString = dateFormat.format(date);
        List<UnbusyStudentsOfCurrentWeek> unbusyStudentsOfCurrentWeekList = this.scheduleService.getUnbusyStudentsOfCurrentWeek(dateString);

        List<String> weekdays = Arrays.asList("星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日");
        List<String> periods = Arrays.asList( "第一节<br>(8:30 - 10:05)", "第二节<br>(10:25 - 12:00)", "第三节<br>(14:00 - 15:35)", "第四节<br>(15:55 - 17:30)", "第五节<br>(18:40 - 21:00)");
        List<String> weekDates = parseDates();
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
        StringBuilder tableHtml = new StringBuilder("<!DOCTYPE html> <html lang=\"zh-CN\"> <head> <meta charset=\"UTF-8\"> <title>今日行程安排</title> <link href=\"https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css\" rel=\"stylesheet\"></head> <body> <table class=\"table mt-4 container-md main\"  border=\"1\">");
        tableHtml.append("<tr><th></th>");

        // 生成星期标题行
        for (int i = 0; i < weekdays.size(); i++) {
            String weekday = weekdays.get(i);
            String Date = weekDates.get(i);
            tableHtml.append(String.format("<th>%s<br>%s</th>", weekday,Date));
            // 这里不需要显式地增加i，因为for循环会为您处理
        }
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

    /**
     * 获取当前日期所在星期的所有对应的日期。
     * @return 时间段的字符串数组
     */
    public static List<String> parseDates() {
        //当前时间的时间戳
        long timestamp = System.currentTimeMillis();
        Date date = new Date(timestamp);
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        //转化为字符串
        String dateString = dateFormat.format(date);
        Long Monday = ScheduleImpl.changeToMonday(dateString);
        // 一天的时间戳（毫秒）
        long oneDayMillis = 24 * 60 * 60 * 1000L;
        List<String> weekDates = new ArrayList<>();
        for(int i = 0; i < 7; i++) {
            weekDates.add(dateFormat.format(new Date(Monday + oneDayMillis * i)));
        }
        // 返回分割后的结果
        return weekDates;
    }
}
