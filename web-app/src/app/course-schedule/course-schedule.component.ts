import {Component, EventEmitter, OnInit} from '@angular/core';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {SweetAlertService} from '../service/sweet-alert.service';
import {CourseService} from '../service/course.service';
import {TermService} from '../service/term.service';
import {Klass} from "../norm/entity/Klass";
import {Term} from "../norm/entity/Term";
import {CourseScheduleService} from "../service/course-schedule.service";
import {User} from "../norm/entity/User";
import {UserService} from "../service/user.service";
import {ScheduleService} from '../service/schedule.service';
import {School} from "../norm/entity/School";
import {KlassService} from "../service/klass.service";

@Component({
  selector: 'app-course-schedule',
  templateUrl: './course-schedule.component.html',
  styleUrls: ['./course-schedule.component.sass']
})
export class CourseScheduleComponent implements OnInit {
  courseTable: any[][] = []; // 确保已经初始化
  semesterStartDate: Date = new Date();
  semesterEndDate: Date = new Date();  // 初始化一个有0条数据的
  searchParameters = {
    schoolId: 0,
    klassId: 0,
    termId: 0,
    week: null
  };
  clazzes = new Array<Klass>();
  terms = new Array<Term>();
  weeks: number[] = [];
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

  constructor(private klassService: KlassService,
              private termService: TermService,
              private courseScheduleService: CourseScheduleService,
              private courseService: CourseService) { }

  ngOnInit(): void {
  }

  onSearchSubmit() {
    console.log('调用了onSearchSubmit()方法');
    console.log(this.searchParameters.schoolId);
    console.log(this.searchParameters.klassId);
    console.log(this.searchParameters.termId);
    console.log(this.searchParameters.week);
    this.courseScheduleService.getCourseTable(
      this.searchParameters.schoolId,
      this.searchParameters.klassId,
      this.searchParameters.termId,
      this.searchParameters.week
    ).subscribe(data => {
      this.processCourseData(data);
    });
  }

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

  onSchoolChange(school: School) {
    this.searchParameters.schoolId = school.id;
    this.searchParameters.klassId = 0;
    this.searchParameters.termId = 0;
    this.searchParameters.week = null;
    this.getClazzBySchoolId(school.id);
    this.getTermsBySchoolId(school.id);
  }

  onTermChange(id: number) {
    this.searchParameters.week = null;
    this.searchParameters.termId = id;
    console.log(this.searchParameters.termId);
    this.termService.getById(id)
      .subscribe(term => {
        console.log(term);
        this.semesterEndDate = term.endTime;
        this.semesterStartDate = term.startTime;
        this.calculateWeeks();
      }, error => {
        console.error('获取学期失败', error);
      });
  }

  calculateWeeks(): void {
    const oneDay = 1000 * 60 * 60 * 24;
    const startTime = new Date(this.semesterStartDate);
    const endTime = new Date(this.semesterEndDate);
    const diffInMilliseconds = endTime.getTime() - startTime.getTime();
    const diffInDays = Math.ceil(diffInMilliseconds / oneDay); // 使用ceil确保包含最后一天
    const numberOfWeeks = Math.ceil(diffInDays / 7);

    this.weeks = [];
    // 创建周数数组
    for (let i = 1; i <= numberOfWeeks; i++) {
      this.weeks.push(i);
    }
    console.log(this.weeks);
  }

  getClazzBySchoolId(schoolId: number) {
    this.klassService.getClazzBySchoolId(schoolId)
      .subscribe(data => {
        this.clazzes = data.content;
      }, error => {
        console.error('获取班级失败', error);
      });
  }

  getTermsBySchoolId(schoolId: number) {
    this.termService.getTermsBySchoolId(schoolId)
      .subscribe(data => {
        this.terms = data.content;
      }, error => {
        console.error('获取学期失败', error);
      });
  }
}
