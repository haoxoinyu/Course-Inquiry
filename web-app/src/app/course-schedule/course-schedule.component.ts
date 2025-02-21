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
import {SchoolService} from "../service/school.service";
interface currentWeekOfSchool {
  schoolName: string,
  currentWeek: string,
  termName: string
}
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
    userId: 0,
    week: 0
};
  dates: string[] = [];
  klasses = new Array<Klass>();
  terms = new Array<Term>();
  schools = new Array<School>();
  weeks: number[] = [];
  users = new Array<User>(new User(2, '', '', 2, ''));
  currentWeekOfSchools: currentWeekOfSchool[] = [];
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
  me: User | undefined;
  firstChange = true;

  constructor(private klassService: KlassService,
              private termService: TermService,
              private schoolService: SchoolService,
              private courseScheduleService: CourseScheduleService,
              private userService: UserService,
              private sweetAlertService: SweetAlertService) { }
  ngOnInit(): void {
    console.log('ngOnInit');
    this.getSchools(); // 调用获取学校列表的方法
    this.userService.me().subscribe(
      user => {
        console.log(user);
        if (user.state === 2) {
          this.sweetAlertService.returnLogin();
        }
        if (this.searchParameters.schoolId === 0 && user.klass && user.klass.school) {
          this.searchParameters.schoolId = user.klass.school.id;
          console.log(this.searchParameters.schoolId)
          this.onSchoolChange(this.searchParameters.schoolId);
        }
        if (this.searchParameters.klassId === 0 && user.klass && user.klass.id !== undefined) {
          this.searchParameters.klassId = user.klass.id;
          console.log(this.searchParameters.klassId);
          this.onKlassChange(this.searchParameters.klassId);
        }
        if (this.searchParameters.userId === 0 && user.id) {
          this.searchParameters.userId = user.id;
          console.log(this.searchParameters.userId);
        }
        if (this.searchParameters.termId === 0) {
          this.termService.getCurrentTerm(this.searchParameters.schoolId).subscribe(
            response => {
              if (response && response.id !== undefined) {
                this.searchParameters.termId = response.id;
                this.semesterStartDate = response.startTime;
                this.semesterEndDate = response.endTime;
                this.semesterStartDate = new Date(response.startTime);
                this.semesterEndDate = new Date(response.endTime);
                this.calculateWeeks();
                this.searchParameters.week = this.calculateCurrentWeek();
                this.getWeekDates(this.searchParameters.week);
                this.onSearchSubmit();
                this.getCurrencyWeekOfEachSchool(this.dates[0]);
              }
            },
            error => {
              this.semesterStartDate = new Date();
              this.semesterEndDate = new Date();
              this.calculateWeeks();
              this.searchParameters.week = this.calculateCurrentWeek();
              this.getWeekDates(1);
              this.getCurrencyWeekOfEachSchool(this.dates[0]);
            });
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  onSearchSubmit() {
    console.log('调用了onSearchSubmit()方法');
    console.log(this.searchParameters.schoolId);
    console.log(this.searchParameters.klassId);
    console.log(this.searchParameters.termId);
    console.log(this.searchParameters.userId);
    console.log(this.searchParameters.week);
    this.getWeekDates(this.searchParameters.week);
    this.courseScheduleService.getCourseTable(this.searchParameters)
      .subscribe(data => {
      this.processCourseData(data);
    });
  }


   //获取当前查询日期是每个学校的哪个学期的第几周
   getCurrencyWeekOfEachSchool(firstDayOfCurrentWeek : string) {
    this.termService.getCurrencyWeekOfEachSchool(firstDayOfCurrentWeek)
    .subscribe((message) => {
      this.currentWeekOfSchools = message;
      this.schools.forEach((school) => {
        let flag = false;
        this.currentWeekOfSchools.forEach((school1) => {
          if(school1.schoolName === school.name) {
            flag = true;
          }
        })
        if(!flag) {
          this.currentWeekOfSchools.push({
            schoolName: school.name,
            currentWeek: '0',
            termName: '暂无学期安排'
          })
        }
      }) 
      console.log(this.currentWeekOfSchools)
    })
  }

  private calculateCurrentWeek(): number {
    const today = new Date();

    // 确保 this.semesterStartDate 是一个有效的 Date 对象
    if (this.semesterStartDate instanceof Date) {
      const startDiff = today.getTime() - this.semesterStartDate.getTime();
      const weekNumber = Math.ceil(startDiff / (1000 * 60 * 60 * 24 * 7));
      console.log(weekNumber);
      return weekNumber;
    } else {
      console.error("semesterStartDate is not a valid Date object");
      return 1; // 或者其他适当的默认值
    }
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

  onSchoolChange(id: number) {
    console.log('调用了');
    if (this.searchParameters.schoolId !== 0) {
      console.log(this.firstChange);
      if (this.firstChange) {
        this.firstChange = false;
      } else {
        this.searchParameters.klassId = 0;
        this.searchParameters.termId = 0;
        this.searchParameters.week = 0;
        this.searchParameters.userId = 0;
        this.weeks = [];
      }
    }
    this.searchParameters.schoolId = id;
    console.log(this.searchParameters.schoolId);
    this.getClazzBySchoolId(id);
    this.getTermsBySchoolId(id);
  }

  onKlassChange(id: number) {
    if (this.searchParameters.klassId !== 0) {
      console.log(this.firstChange);
      if (this.firstChange) {
        this.firstChange = false;
      } else {
        this.searchParameters.userId = 0;
      }
    }
    this.searchParameters.klassId = id;
    console.log(this.searchParameters.klassId);
    this.getUsersByKlassId(id);
  }

  getSchools(): void {
    this.schoolService.all().subscribe(
      (data: School[]) => {
        this.schools = data;
      },
      (error) => {
        console.error('Error fetching schools:', error);
      }
    );
  }

  onTermChange(id: number) {
    this.searchParameters.week = 0;
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
        this.klasses = data.content;
      }, error => {
        console.error('获取班级失败', error);
      });
  }

  getTermsBySchoolId(schoolId: number) {
    this.termService.getTermsBySchoolId(schoolId)
      .subscribe(data => {
        this.terms = data.content;
        console.log(this.terms);
      }, error => {
        console.error('获取学期失败', error);
      });
  }

  getUsersByKlassId(klassId: number) {
    console.log('调用了获取用户的方法');
    this.userService.getUsersByKlassId(klassId)
      .subscribe(data => {
        this.users = data;
        console.log(this.users,klassId);
      }, error => {
        console.error('获取用户失败', error);
      });
  }

  getWeekDates(weekNumber: number): void {
    const start = new Date(this.semesterStartDate);
    start.setDate(start.getDate() + (weekNumber - 1) * 7);
    const dates = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      const formattedDate = date.getFullYear() + '-' +
        ('0' + (date.getMonth() + 1)).slice(-2) + '-' +
        ('0' + date.getDate()).slice(-2);
      dates.push(formattedDate);
      start.setDate(start.getDate() + 1);
    }

    this.dates = dates;
  }
}
