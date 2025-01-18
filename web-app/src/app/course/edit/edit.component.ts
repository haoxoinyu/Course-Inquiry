import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {School} from '../../norm/entity/School';
import {Term} from '../../norm/entity/Term';
import {Klass} from '../../norm/entity/Klass';
import {Course} from '../../norm/entity/Course';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {ShareService} from '../../service/share.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CourseService} from '../../service/course.service';
import {SweetAlertService} from '../../service/sweet-alert.service';
import {Subscription} from 'rxjs';
import {UserService} from '../../service/user.service';
import {User} from '../../norm/entity/User';
import { KlassService } from 'src/app/service/klass.service';
import { TermService } from 'src/app/service/term.service';
import { SchoolService } from 'src/app/service/school.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.sass']
})
export class EditComponent implements OnInit {

/**
   * 课表名称.
   */
nameFormControl = new FormControl('', Validators.required);

course = {
  id: null as unknown as number,
  name: '',
  sory: null as unknown as number,
  school_id: null as unknown as number,
  clazz_id: null as unknown as number,
  term_id: null as unknown as number,
  week: [],
  day: [],
  period: [],
};
value = '';
terms = new Array<Term>();
clazzes = new Array<Klass>();
users = new Array<User>();

semesterStartDate: Date | undefined;
semesterEndDate: Date | undefined;

weeks: number[] = [];
days: {name: string, value: number}[] = [
  {name: '周一', value: 1},
  {name: '周二', value: 2},
  {name: '周三', value: 3},
  {name: '周四', value: 4},
  {name: '周五', value: 5},
  {name: '周六', value: 6},
  {name: '周日', value: 7},
];
periods: {name: string, value: number}[] = [
  {name: '第一大节', value: 1},
  {name: '第二大节', value: 2},
  {name: '第三大节', value: 3},
  {name: '第四大节', value: 4},
  {name: '第五大节', value: 5}
];

/**
 * 表单组，用于存放多个formControl
 */
formGroup = new FormGroup({
  id: new FormControl(0, Validators.required),
  name: this.nameFormControl,
  sory: new FormControl(0, Validators.required),
  school_id: new FormControl(0, Validators.required),
  term_id: new FormControl(0, Validators.required),
  clazz_id: new FormControl(0, Validators.required),
  week: new FormControl([0], Validators.required),
  day: new FormControl([0], Validators.required),
  period: new FormControl([0], Validators.required)
});
private termIdSubscription: Subscription | undefined;
// tslint:disable-next-line:variable-name
term_id: number | undefined;


constructor(private httpClient: HttpClient,
            private userService: UserService,
            private activatedRoute: ActivatedRoute,
            private sharedService: ShareService,
            private sweetAlertService: SweetAlertService,
            public dialogRef: MatDialogRef<EditComponent>,
            @Inject(MAT_DIALOG_DATA) public data: any,
            private courseService: CourseService,
            private klassService: KlassService,
            private termService: TermService,
            private schoolService: SchoolService) { }

ngOnInit(): void {
  // tslint:disable-next-line:no-non-null-assertion
  this.termIdSubscription = this.formGroup.get('term_id')!.valueChanges.subscribe(value => {
    console.log('Term ID changed to:', value);
    this.onTermChange(value ?? 0);
  });
  const id = this.activatedRoute.snapshot.params['id'];
  this.loadById(+id);
}

/**
 * 由后台加载预编辑的课表.
 * @param id 课表id.
 */
loadById(id: number): void {
  console.log('loadById');
  id = this.data.id;
  console.log('传过来的id',id);
  this.formGroup.get('id')?.setValue(id);
  console.log(this.formGroup.value);
  this.httpClient.post<Course>(`api/course/edit/${id}`, id)
    .subscribe(course => {
      console.log('接收到了course', course);
      this.nameFormControl.patchValue(course.name);
      this.formGroup.get('school_id')?.setValue(course.term.school!.id);
      this.formGroup.get('term_id')?.setValue(course.term.id!);
      this.formGroup.get('sory')?.setValue(course.sory);
      this.formGroup.get('clazz_id')?.setValue(course.klass.id!);
      this.formGroup.get('week')?.setValue(course.week);
      console.log(course.week);
      this.formGroup.get('period')?.setValue(course.period);
      this.formGroup.get('day')?.setValue(course.day);
      // 如果课程是选修的，加载用户列表
      if (course.sory === 0) {
        this.onSoryChange();
      }
    }, error => console.log(error));
}

onSubmit(): void {
  console.log('点击了提交按钮');
  console.log(this.formGroup.value);
  const courseId = this.formGroup.get('id')?.value;
  const name = this.nameFormControl.value;
  const clazzId = this.formGroup.get('clazz_id')?.value;
  const schoolId = this.formGroup.get('school_id')?.value;
  const sory = this.formGroup.get('sory')?.value;
  const week = this.formGroup.get('week')?.value;
  const day = this.formGroup.get('day')?.value;
  const period = this.formGroup.get('period')?.value;
  const termId = this.formGroup.get('term_id')?.value;
  const course = {
    id: courseId,
    name,
    schoolId: schoolId,
    clazzId: clazzId,
    termId: termId,
    week,
    day,
    period,
    sory
  };
  console.log(course);
  this.httpClient.put<Course>(`/api/course/update`, course)
    .subscribe(() => {
        // 更新成功后，导航回主列表页面
        try {
          this.dialogRef.close(course);
          this.sweetAlertService.showSuccess('编辑成功！', 'success');
        } catch (err) {
          console.log('Navigation failed', err);
        }
      },
      error => {
        if (error.error.error === '课程已存在') {
          this.sweetAlertService.showError('编辑失败', '课程已存在', 'error');
        } else if (error.error.error === '与已有必修课程的时间冲突') {
          this.sweetAlertService.showError('编辑失败', '与已有必修课程的时间冲突', 'error');
        } else if (error.error.error === '与已有选修课程的时间冲突') {
          this.sweetAlertService.showError('编辑失败', '与已有选修课程的时间冲突', 'error');
        } else {
          this.sweetAlertService.showError('编辑失败', '', 'error');
        }
        console.log(error);
      });
}

onNoClick(): void {
  this.dialogRef.close();
}

get school_id() {
  console.log('school_id');
  return this.formGroup.get('school_id');
}

getClazzBySchoolId(schoolId: number) {
  this.klassService.getClazzBySchoolId(schoolId)
    .subscribe(clazzes => {
      this.clazzes = clazzes;
    }, error => {
      console.error('获取班级失败', error);
    });
}

getTermsBySchoolId(schoolId: number) {
  this.termService.getTermsBySchoolId(schoolId)
    .subscribe(terms => {
      this.terms = terms;
    }, error => {
      console.error('获取学期失败', error);
    });
}

onSchoolChange(schoolId: number) {
  this.course.school_id = schoolId;
  console.log(this.course.school_id);
  this.getClazzBySchoolId(this.course.school_id);
  this.getTermsBySchoolId(this.course.school_id);
}

onTermChange(termId: number) {
  this.course.term_id = termId;
  console.log(this.course.term_id);
  this.termService.getTermById(termId)
    .subscribe(term => {
      console.log(term);
      console.log(term.startTime);
      this.semesterEndDate = term.endTime;
      this.semesterStartDate = term.startTime;
      this.calculateWeeks();
    }, error => {
      console.error('获取学期失败', error);
    });
}

onSoryChange() {
  // const sory = this.formGroup.get('sory')?.value;
  // this.userService.getUserWhenSoryChange(this.formGroup.get('school_id')?.value, this.formGroup.get('clazz_id')?.value)
  //   .subscribe(users => {
  //     this.users = users;
  //   }
  // );
}

calculateWeeks(): void {
  const oneDay = 1000 * 60 * 60 * 24;
  const startTime = new Date(this.semesterStartDate!);
  const endTime = new Date(this.semesterEndDate!);
  const diffInMilliseconds = endTime.getTime() - startTime.getTime();
  const diffInDays = Math.ceil(diffInMilliseconds / oneDay); // 使用ceil确保包含最后一天
  const numberOfWeeks = Math.ceil(diffInDays / 7);

  // 创建周数数组
  console.log(numberOfWeeks);
  this.weeks = [];
  for (let i = 1; i <= numberOfWeeks; i++) {
    this.weeks.push(i);
    console.log(this.weeks);
  }
}

}
