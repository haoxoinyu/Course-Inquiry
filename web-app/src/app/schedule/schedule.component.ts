import {Component, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ScheduleService } from '../service/schedule.service';
import { User } from '../norm/entity/User';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.sass']
})
export class ScheduleComponent implements OnInit {

  sectionNumber = Array.from({ length: 5 }, (_, i) => i + 1);
  dateNumber = Array.from({ length: 7 }, (_, i) => i + 1);
  currentDate = new Date();
  formGroup = new FormGroup({
    date : new FormControl('', Validators.required),
  });
  data = {
    date: '',
  }
  PeopleHaveCourse = [{
    time: '',
    user: new User(1,'','',1,'')
  }];
  weekDates: string[] = [];

  constructor(private scheduleService: ScheduleService) { }

  ngOnInit(): void {
    // 显示加载提示
    // 调用函数来格式化日期
    let formattedDate = this.formatDateToYYYYMMDD(this.currentDate);
    this.formGroup.get('date')?.setValue(formattedDate);

    this.scheduleService.getFirstDayOfCurrentWeek(this.formGroup.get('date')?.value!)
      .subscribe((firstDayOfCurrentWeek) => {
        this.caculateWeekDay(firstDayOfCurrentWeek);
        const date1 =  new Date(firstDayOfCurrentWeek);
        const requestDate = this.formatDateToYYYYMMDD(date1);
        console.log('时间戳：', firstDayOfCurrentWeek, '日期： ', date1.getDate())
        this.scheduleService.getUnbusyStudentsOfCurrentWeek(requestDate)
          .subscribe((data) => {

            this.PeopleHaveCourse = data;
            console.log("unbuys",this.PeopleHaveCourse)
            // 隐藏加载提示
          }, error => {
            // 如果发生错误，隐藏加载提示并处理错误
            console.error(error);
          });
      }, error => {
        // 如果发生错误，隐藏加载提示并处理错误
        console.error(error);
      });
  }


  onSubmit() {
    this.scheduleService.getFirstDayOfCurrentWeek(this.formGroup.get('date')?.value!)
    .subscribe((firstDayOfCurrentWeek) => {
      const date1 =  new Date(firstDayOfCurrentWeek);

      const requestDate = this.formatDateToYYYYMMDD(date1);
      console.log('时间戳：', firstDayOfCurrentWeek, '日期： ', date1.getDate())
      this.caculateWeekDay(firstDayOfCurrentWeek);
      this.scheduleService.getUnbusyStudentsOfCurrentWeek(requestDate)
        .subscribe((data) => {
          this.PeopleHaveCourse = data;
        })
    })
  }

  //获取整个星期每天的日期
  caculateWeekDay(firstDayOfCurrentWeek : number) {
    this.weekDates = [];
    //创建一个date对象才能进行操作
    const Monday = new Date(firstDayOfCurrentWeek);
    for(let i=0; i< 7; i++) {
      const date = new Date(Monday);
      date.setDate(Monday.getDate() + i);
      // 自定义格式化函数
      const formattedDate = this.formatDateToYYYYMMDD(date);
      this.weekDates.push(formattedDate);
    }
  }

  // 格式化日期的函数
  formatDateToYYYYMMDD(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const time = date.getTime();
    return `${year}-${month}-${day}`;
  }

    // 辅助方法：根据日期返回星期几（中文）
    getDayOfWeek(day: number): string {
      const daysOfWeek = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六','星期日'];
      return daysOfWeek[day];
    }
}
