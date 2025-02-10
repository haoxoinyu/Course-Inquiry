package com.mengyunzhi.springBootStudy.service;

import com.mengyunzhi.springBootStudy.entity.*;
import com.mengyunzhi.springBootStudy.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class ScheduleImpl implements ScheduleService{

    @Autowired
    TermRepository termRepository;
    @Autowired
    SchoolRepository schoolRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    KlassRepository klassRepository;
    @Autowired
    CourseRepository courseRepository;

    @Override
    public Long changeToMonday(String date) {
        LocalDate DateOfMonday;
        //创建一个可以处理时间字符串的控制器
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        //转化为可以操作的时间对象
        LocalDate localDate = LocalDate.parse(date, formatter);
        //转化为有时区的时间对象
        //获取传入时间的星期数
        DayOfWeek dayOfWeek = localDate.getDayOfWeek();
        switch (dayOfWeek) {
            case SUNDAY:
                DateOfMonday = localDate.minusDays(6);
                break;
            case MONDAY:
                DateOfMonday = localDate;
                break;
            case TUESDAY:
                DateOfMonday = localDate.minusDays(1);
                break;
            case WEDNESDAY:
                DateOfMonday = localDate.minusDays(2);
                break;
            case THURSDAY:
                DateOfMonday = localDate.minusDays(3);
                break;
            case FRIDAY:
                DateOfMonday = localDate.minusDays(4);
                break;
            case SATURDAY:
                DateOfMonday = localDate.minusDays(5);
                break;
            default:
                DateOfMonday = localDate;
                break;
        }
        LocalDateTime dateTime = DateOfMonday.atStartOfDay();
        ZonedDateTime zonedDateTime = dateTime.atZone(ZoneId.systemDefault());
        return zonedDateTime.toInstant().toEpochMilli();
    }

    @Override
    public List<UnbusyStudentsOfCurrentWeek> getUnbusyStudentsOfCurrentWeek(String date) {
        //转化为周一
        Long timestamp =this.changeToMonday(date);
        //空闲的学生
        List<UnbusyStudentsOfCurrentWeek> unbusyStudentsOfCurrentWeekList = new ArrayList<UnbusyStudentsOfCurrentWeek>();
        Date formatDate = new Date(timestamp);
        List<Term> inRangeTerms = this.termRepository.findTermsInRange(formatDate);

        for(Term term : inRangeTerms){
            //计算在这个学期是第几周
            Date StartDate = term.getStartTime();
            LocalDate localDate1 = StartDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
            LocalDate localDate2 = formatDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
            Long offsetWeek = ChronoUnit.DAYS.between(localDate1, localDate2) / 7 - 1;
            //查找关联学校
            Optional<School> innnerSchool = this.schoolRepository.findById(term.getSchool().getId());
            //查找关联班级
            List<Klass> innerKlasses = this.klassRepository.findBySchool(innnerSchool.get());
            for(Klass klass : innerKlasses) {
                //查找关联学生
                List<User> innerUsers = this.userRepository.findByKlass(klass);
                for(User user : innerUsers) {
                    List<User> userList = new ArrayList<User>();
                    userList.add(user);
                   List<Course> innerCourses = this.courseRepository.findByUsers(userList);
                   for(Course course : innerCourses) {
                       if(course.getWeek().contains(offsetWeek.intValue() + 2)) {
                           //拼接时间段字符串
                           List<Integer> dayList = course.getDay();
                           for(Integer day: dayList) {
                               for(Integer period : course.getPeriod()) {
                                   String time = day + "-" + period;
                                   UnbusyStudentsOfCurrentWeek unbusyStudentOfCurrentWeek = new UnbusyStudentsOfCurrentWeek(user, time);
                                   unbusyStudentsOfCurrentWeekList.add(unbusyStudentOfCurrentWeek);
                               }
                           }
                       }
                   }
                }
            }
        }
        return  unbusyStudentsOfCurrentWeekList;
    }

}
