import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Course } from 'src/app/norm/entity/Course';
import { Page } from 'src/app/norm/entity/page';
import { CourseScheduleService } from 'src/app/service/course-schedule.service';
import { CourseService } from 'src/app/service/course.service';
import { TermService } from 'src/app/service/term.service';
import { UserService } from 'src/app/service/user.service';
import { AddComponent } from '../add/add.component';
import { CreateComponent } from 'src/app/my-course/create/create.component';
import { Term } from 'src/app/norm/entity/Term';

@Component({
  selector: 'app-course-schedule',
  templateUrl: './course-schedule.component.html',
  styleUrls: ['./course-schedule.component.sass']
})
export class CourseScheduleComponent implements OnInit{
  sectionNumber = Array.from({ length: 5 }, (_, i) => i + 1);
  dateNumber = Array.from({ length: 7 }, (_, i) => i + 1);
  courseTable: any[][] = []; // 确保已经初始化
  searchParameters = {
    schoolId: 0,
    klassId: 0,
    termId: 0,
    userId: 0,
    name: '',
    page: 0,
    size: 1000000
  };
  terms = new Array<Term>();
  currentTermName = '' ;
  constructor(
    private termService: TermService,
    private userService: UserService,
    private courseService: CourseService,
    private dialog: MatDialog,
 
  ) {

  }
  ngOnInit(): void {
    this.userService.me()
      .subscribe((user) => {
        this.searchParameters.userId = user.id;
        this.termService.getTermsBySchoolId(user.klass?.school?.id!)
        .subscribe((terms) => {
          this.terms = terms.content
        })
        this.termService.getCurrentTerm(user.klass?.school?.id!)
          .subscribe((term) => {
            this.currentTermName = term.name!;
            this.searchParameters.termId = term.id!;
            this.courseService.page(this.searchParameters)
              .subscribe(data => {
              this.processCourseData(data);
              console.log('课程详情', data)
            });
          })
      })
  }
  onTermChange() {
    this.courseService.page(this.searchParameters)
    .subscribe(data => {
    this.processCourseData(data);
    console.log('课程详情', data)
  });
  }
  processCourseData(courses: Page<Course>) {
    // 初始化课表，最多7天，每天5个大节
    this.courseTable = Array.from({ length: 7 }, () => 
      Array.from({ length: 5 }, () => 
        Array.from({ length: 2 }, () => 
          new Array(2).fill(''))));

    courses.content.forEach((course) => {
      const dayIndex = course.day[0] - 1; // 转换为整数并减1，因为数组索引从0开始
      const periodIndex = course.period[0] - 1; // 转换为整数并减1
      const nameState = 0;
      const timeState = 1;
      // 检查索引是否在有效范围内
      if (dayIndex >= 0 && dayIndex < 7 && periodIndex >= 0 && periodIndex < 5) {
        //判断同一时间段是否有课
        if( this.courseTable[dayIndex][periodIndex][0][0] !== '') {
          const length = this.courseTable[dayIndex][periodIndex].length;
          console.log('不等于空', length)
          this.courseTable[dayIndex][periodIndex][length - 1][0] = course.name;
          this.courseTable[dayIndex][periodIndex][length - 1][1] = course.week[0] + '-' + course.week[course.week.length - 1] + '周'
        }else{
          // 直接将课程名称赋值到对应的位置
          this.courseTable[dayIndex][periodIndex][0][0] = course.name;
          this.courseTable[dayIndex][periodIndex][0][1] = course.week[0] + '-' + course.week[course.week.length - 1] + '周'
        }
      } else {
        console.error('无效的课程表索引:', dayIndex, periodIndex);
      }
    });
    console.log('couresTable',this.courseTable);
  }

  openAddDialog(date: number, section: number): void {
    const dialogRef = this.dialog.open(CreateComponent, {
      width: '900px',
      height: '700px',
      data:{
        date: date,
        section: section,
        termId: this.searchParameters.termId,
        termName: this.currentTermName
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.ngOnInit();
    });
  }

}
