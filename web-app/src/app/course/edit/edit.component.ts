import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
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
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.sass']
})
export class EditComponent implements OnInit {

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

  formGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    schoolId: new FormControl(0, Validators.required),
    termId: new FormControl(0, Validators.required),
    userId: new FormControl(0, Validators.required),
    klassId: new FormControl(0, Validators.required),
    sory: new FormControl(0, Validators.required),
    week:  new FormControl([] as number [], Validators.required),
    day: new FormControl(0, Validators.required),
    period: new FormControl(0, Validators.required)
  })

  value = '';
  schools = new Array<School>();
  terms = new Array<Term>();
  term = new Term(1, '', new School(1, ''), new Date(), new Date());
  clazzes : Klass[] = [new Klass(1, '',undefined)];
  users = new Array<User>(new User(1,'', '', 1,''));

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
  beLogout = new EventEmitter<void>();


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
  this.courseService.getById(this.data.id)
    .subscribe((course) => {
      this.onSchoolChange(course.term.school!);
      this.onTermChange(course.term.id!);
      this.onKlassChange(course.users[0]!.klass!.id!)
      this.course.name = course.name;
      this.course.user_id = course.users[0].id;
      this.schools.push(course.term.school!);
      this.formGroup.get('name')!.setValue(course.name),
      this.formGroup.get('sory')!.setValue(course.sory),
      this.updateWeekFromControl(course.week),
      this.formGroup.get('day')!.setValue(course.day[0]),
      this.formGroup.get('period')!.setValue(course.period[0]),
      this.formGroup.get('schoolId')!.setValue(course.term.school!.id), 
      this.formGroup.get('klassId')!.setValue(course.users[0]!.klass!.id as number),
      this.formGroup.get('termId')!.setValue(course.term.id as number)
      this.formGroup.get('userId')?.setValue(course.users[0].id)
      console.log(this.formGroup.get('day')!.value)
    })
}
  updateWeekFromControl(weeks:number[]) {
    weeks.forEach(week => {
      (this.formGroup.get('week')!.value as number[]).push(week);
    })
    console.log(this.formGroup.get('week')!.value)
  }
onSubmit(): void {
  console.log(this.formGroup.get('week')!.value)
  const newCourse = {
      id: this.data.id,
      name: this.formGroup.get('name')!.value!,
      sory: this.formGroup.get('sory')!.value!,
      week: this.formGroup.get('week')!.value!,
      day: this.formGroup.get('day')!.value,
      period: this.formGroup.get('period')!.value!,
      schoolId: this.formGroup.get('schoolId')!.value!,
      clazz_id: this.formGroup.get('klassId')!.value!,
      term_id: this.formGroup.get('termId')!.value!,
      userId: this.formGroup.get('userId')!.value!
  }
  this.courseService.update(newCourse)
    .subscribe(clazz => {
        this.dialogRef.close(newCourse);
        this.sweetAlertService.showSuccess('新增成功！', 'success');
      },
      error => {
        if (error.error.error === '课程已存在') {
          this.sweetAlertService.showError('新增失败', '课程已存在', 'error');
        } else if (error.error.error === '与已有课程的时间冲突') {
          this.sweetAlertService.showError('新增失败', '与已有课程的时间冲突', 'error');
        } else {
          this.sweetAlertService.showError('新增失败', '', 'error');
        }
        console.log('保存失败', error);
      });
}

onNoClick(): void {
  this.dialogRef.close();
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

onSchoolChange(school: School) {
  this.course.school_id = school.id;
  this.formGroup.get('schoolId')?.setValue(school.id);
  this.getClazzBySchoolId(school.id);
  this.getTermsBySchoolId(school.id);
}

onKlassChange(klassId: number) {
  this.course.clazz_id = klassId;
  this.formGroup.get('klassId')?.setValue(klassId);
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
