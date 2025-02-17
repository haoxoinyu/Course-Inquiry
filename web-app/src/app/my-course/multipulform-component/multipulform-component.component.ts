import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {School} from "../../norm/entity/School";
import {Term} from "../../norm/entity/Term";
import {Klass} from "../../norm/entity/Klass";
import {User} from "../../norm/entity/User";
import {HttpClient} from "@angular/common/http";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UserService} from "../../service/user.service";
import {SweetAlertService} from "../../service/sweet-alert.service";
import {CourseService} from "../../service/course.service";
import {KlassService} from "../../service/klass.service";
import {TermService} from "../../service/term.service";
import {SchoolService} from "../../service/school.service";
import { Observable } from 'rxjs';

@Component({
  selector: 'app-multipulform-component',
  templateUrl: './multipulform-component.component.html',
  styleUrls: ['./multipulform-component.component.sass']
})
export class MultipulformComponentComponent implements OnInit{

  _formGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    schoolId: new FormControl(0),
    termId: new FormControl(0, Validators.required),
    userId: new FormControl([] as number[]),
    klassId: new FormControl(0),
    sory: new FormControl(0, Validators.required),
    week: new FormControl([] as number[], Validators.required),
    day: new FormControl(null as unknown as number, Validators.required),
    period: new FormControl(null as unknown as number, Validators.required)
  })

  termName = ''
  semesterStartDate: Date | undefined;
  semesterEndDate: Date | undefined;

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

    /** 数据列表 */
    @Input()
    set formGroup(value: FormGroup) {
      this._formGroup = value; // 在 set 访问器中处理值
      console.log('传入数据到multiplefrom', value)
    }
  
    /** 事件弹射器，用户点选后将最终的结点弹射出去 */
    @Output()
    changed = new EventEmitter<FormGroup>();

  constructor(
    private termService: TermService
  ) {
  }

  ngOnInit() {
    this.termService.getById(this._formGroup.get('termId')?.value!)
      .subscribe((term) => {
        this.semesterEndDate = term.endTime;
        this.semesterStartDate = term.startTime;
        this.calculateWeeks();
        this.termName = term.name!;
      })
  }

  onChange() {
    this.changed.emit(this._formGroup);
    console.log('传出数据到multiplefrom')
  }

  calculateWeeks(): void {
    this.weeks = [];
    const oneDay = 1000 * 60 * 60 * 24;
    const startTime = new Date(this.semesterStartDate ?? new Date());
    const endTime = new Date(this.semesterEndDate ?? new Date());
    const diffInMilliseconds = endTime.getTime() - startTime.getTime();
    const diffInDays = Math.ceil(diffInMilliseconds / oneDay); // 使用ceil确保包含最后一天
    const numberOfWeeks = Math.ceil(diffInDays / 7);
    // 创建周数数组
    for (let i = 1; i <= numberOfWeeks; i++) {
      this.weeks.push(i);
    }
  }

}

