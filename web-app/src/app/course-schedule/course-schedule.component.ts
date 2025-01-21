import {Component, EventEmitter, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {SweetAlertService} from '../service/sweet-alert.service';
import {CourseService} from '../service/course.service';
import {TermService} from '../service/term.service';
import {Klass} from "../norm/entity/Klass";
import {Term} from "../norm/entity/Term";
import {CourseScheduleService} from "../service/course-schedule.service";
import {User} from "../norm/entity/User";
import {UserService} from "../service/user.service";

@Component({
  selector: 'app-course-schedule',
  templateUrl: './course-schedule.component.html',
  styleUrls: ['./course-schedule.component.sass']
})
export class CourseScheduleComponent implements OnInit {
  courseTable: any[][] = []; // 确保已经初始化
  klasses = new Array<Klass>();
  terms = new Array<Term>();
  firstChange = true;

  weeks: number[] = [];
  dates: Date[] = [];
  days = [
    {name: '周一', value: 1},
    {name: '周二', value: 2},
    {name: '周三', value: 3},
    {name: '周四', value: 4},
    {name: '周五', value: 5},
    {name: '周六', value: 6},
    {name: '周日', value: 7},
  ];
  periods = [
    {name: '第一大节', value: 1},
    {name: '第二大节', value: 2},
    {name: '第三大节', value: 3},
    {name: '第四大节', value: 4},
    {name: '第五大节', value: 5}
  ];
  searchParameters = {
    school: null as unknown as number,
    klass: null,
    term: null,
    week: null
  };

  beLogout = new EventEmitter<void>();

  constructor(private courseScheduleService: CourseScheduleService,
              private httpClient: HttpClient,
              private userService: UserService,
              private termService: TermService,
              private sweetAlertService: SweetAlertService,
              private courseService: CourseService) {
  }

  ngOnInit() {}

  processCourseData(courses: any[]) {
    // 初始化课表，最多7天，每天5个大节
    this.courseTable = Array.from({ length: 7 }, () => new Array(5).fill(''));

    courses.forEach((course) => {
      const dayIndex = course.day - 1; // 转换为整数并减1，因为数组索引从0开始
      const periodIndex = course.period - 1; // 转换为整数并减1

      // 检查索引是否在有效范围内
      if (dayIndex >= 0 && dayIndex < 7 && periodIndex >= 0 && periodIndex < 5) {
        // 直接将课程名称赋值到对应的位置
        this.courseTable[dayIndex][periodIndex] = course.name;
      } else {
        console.error('无效的课程表索引:', dayIndex, periodIndex);
      }
    });
  }
}
