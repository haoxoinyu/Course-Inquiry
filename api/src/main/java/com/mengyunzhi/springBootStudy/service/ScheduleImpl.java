package com.mengyunzhi.springBootStudy.service;

import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class ScheduleImpl implements ScheduleService{

    @Override
    public Long changeToMonday(String date) {
        ZonedDateTime zonedDateTimeOfMonday;
        //创建一个可以处理时间字符串的控制器
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        //转化为可以操作的时间对象
        LocalDateTime localDateTime = LocalDateTime.parse(date, formatter);
        //转化为有时区的时间对象
        ZonedDateTime zonedDateTime = localDateTime.atZone(ZoneId.systemDefault());
        //获取传入时间的星期数
        DayOfWeek dayOfWeek = zonedDateTime.getDayOfWeek();
        switch (dayOfWeek) {
            case SUNDAY:
                zonedDateTimeOfMonday = zonedDateTime.minusDays(6);
                break;
            case MONDAY:
                zonedDateTimeOfMonday = zonedDateTime;
                break;
            case TUESDAY:
                zonedDateTimeOfMonday = zonedDateTime.minusDays(1);
                break;
            case WEDNESDAY:
                zonedDateTimeOfMonday = zonedDateTime.minusDays(2);
                break;
            case THURSDAY:
                zonedDateTimeOfMonday = zonedDateTime.minusDays(3);
                break;
            case FRIDAY:
                zonedDateTimeOfMonday = zonedDateTime.minusDays(4);
                break;
            case SATURDAY:
                zonedDateTimeOfMonday = zonedDateTime.minusDays(5);
                break;
            default:
                zonedDateTimeOfMonday = zonedDateTime;
                break;
        }
        return zonedDateTimeOfMonday.toInstant().toEpochMilli();
    }
}
