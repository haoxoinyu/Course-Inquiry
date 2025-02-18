import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {TermService} from "../../service/term.service";
import { UserService } from 'src/app/service/user.service';
import { SweetAlertService } from 'src/app/service/sweet-alert.service';
import { CourseService } from 'src/app/service/course.service';
import { KlassService } from 'src/app/service/klass.service';
import { SchoolService } from 'src/app/service/school.service';
import { School } from 'src/app/norm/entity/School';
import { Term } from 'src/app/norm/entity/Term';
import { Klass } from 'src/app/norm/entity/Klass';
import { User } from 'src/app/norm/entity/User';

@Component({
  selector: 'app-multiple-form-of-course',
  templateUrl: './multiple-form-of-course.component.html',
  styleUrls: ['./multiple-form-of-course.component.sass']
})
export class MultipleFormOfCourseComponent implements OnInit{
  course = {
    name: '',
    school_id: null as unknown as number,
    term_id: null as unknown as number,
    clazz_id: null as unknown as number,
    user_id: null as unknown as number,
    sory: 1,
    week: [],
    day: null as unknown as number,
    period: null as unknown as number
  };
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

  value = '';
  schools = new Array<School>();
  terms = new Array<Term>();
  term = new Term(1, '', new School(1, ''), new Date(), new Date());
  clazzes: Klass[] = [new Klass(1, '', undefined)];
  users = new Array<User>(new User(1, '', '', 1, ''));
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
    private userService: UserService,
    private sweetAlertService: SweetAlertService,
    private courseService: CourseService,
    private klassService: KlassService,
    private termService: TermService,
    private schoolService: SchoolService
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
  
  onSchoolChange(school: School) {
    this.course.school_id = school.id;
    this._formGroup.get('schoolId')?.setValue(school.id);
    this.getClazzBySchoolId(school.id);
    this.getTermsBySchoolId(school.id);
  }

  onKlassChange(klassId: number) {
    this.course.clazz_id = klassId;
    this._formGroup.get('klassId')?.setValue(klassId);
    this.getUsersByKlassId(klassId);
  }

  onTermChange(termId: number) {
    this.course.term_id = termId;
    this.termService.getTermById(termId)
      .subscribe(term => {
        this.semesterEndDate = term.endTime;
        this.semesterStartDate = term.startTime;
        this.calculateWeeks();
      }, error => {
        console.error('获取学期失败', error);
      });
  }
  getClazzBySchoolId(schoolId: number) {
    this.klassService.getClazzBySchoolId(schoolId)
      .subscribe(data => {
        this.clazzes = data.content;
      }, error => {
        console.error('获取班级失败', error);
      });
  }

  getUsersByKlassId(klassId: number) {
    this.userService.getUsersByKlassId(klassId)
      .subscribe((data) => {
        this.users = data;
      })
  }

  getTermsBySchoolId(schoolId: number) {
    this.termService.getTermsBySchoolId(schoolId)
      .subscribe(data => {
        this.terms = data.content;
      }, error => {
        console.error('获取学期失败', error);
      });
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
