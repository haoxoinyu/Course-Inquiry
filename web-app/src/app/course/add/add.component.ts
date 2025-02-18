import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {School} from '../../norm/entity/School';
import {Term} from '../../norm/entity/Term';
import {Klass} from '../../norm/entity/Klass';
import {HttpClient} from '@angular/common/http';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CourseService} from '../../service/course.service';
import {SweetAlertService} from '../../service/sweet-alert.service';
import {User} from '../../norm//entity/User';
import {UserService} from '../../service/user.service';
import { KlassService } from 'src/app/service/klass.service';
import { TermService } from 'src/app/service/term.service';
import { SchoolService } from 'src/app/service/school.service';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.sass']
})
export class AddComponent implements OnInit {

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
  formGroups: FormGroup[] = [];

  value = '';
  schools = new Array<School>();
  terms = new Array<Term>();
  term = new Term(1, '', new School(1, ''), new Date(), new Date());
  clazzes: Klass[] = [new Klass(1, '', undefined)];
  users = new Array<User>(new User(1, '', '', 1, ''));

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
              public dialogRef: MatDialogRef<AddComponent>,
              private userService: UserService,
              private sweetAlertService: SweetAlertService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private courseService: CourseService,
              private klassService: KlassService,
              private termService: TermService,
              private schoolService: SchoolService) {
  }



  ngOnInit() {
    this.addForm();
    // 获取所有学校
    this.schoolService.all()
      .subscribe(schools => this.schools = schools)
  }

  addForm() {
    const formGroup = new FormGroup({
      name: new FormControl('', Validators.required),
      schoolId: new FormControl(0),
      termId: new FormControl(0, Validators.required),
      userId: new FormControl([] as number[]),
      klassId: new FormControl(0),
      sory: new FormControl(0, Validators.required),
      week: new FormControl([] as number[], Validators.required),
      day: new FormControl(0, Validators.required),
      period: new FormControl(0, Validators.required)
    })
    this.formGroups.push(formGroup);
  }

  // 使用 getter 方法来检查所有表单组是否有效
  get checkAllFormGroups(): boolean {
    return this.formGroups.every(formGroup => formGroup.valid);
  }

  onSubmit(): void {
    this.formGroups.forEach((formGroup) => {
      const newCourse = {
        name: formGroup.get('name')!.value,
          sory: formGroup.get('sory')!.value,
          week: formGroup.get('week')!.value!,
          day: formGroup.get('day')!.value,
          period: formGroup.get('period')!.value,
          schoolId: formGroup.get('schoolId')!.value,
          clazz_id: formGroup.get('klassId')!.value,
          term_id: formGroup.get('termId')!.value,
          userId: formGroup.get('userId')!.value!
      }
      this.courseService.add(newCourse)
      .subscribe((data: any) => {
          if (data.message === '课程名称长度最小为2位') {
            this.sweetAlertService.showError('新增失败', '课程名称长度最小为2位', 'error');
          } else if (data.message === '与已有课程时间冲突') {
            this.sweetAlertService.showError('新增失败', '与已有课程时间冲突', 'error');
          } else {
            this.dialogRef.close(newCourse);
            this.sweetAlertService.showSuccess('新增成功！', 'success');
          }
        },
        error => {
          console.log('保存失败', error.error.message);
          if (error.error.message === '课程名称长度最小为2位') {
            this.sweetAlertService.showError('新增失败', '课程名称长度最小为2位', 'error');
          } else {
            this.sweetAlertService.showError('新增失败', '', 'error');
          }
        });
    })
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
    this.formGroups[0].get('schoolId')?.setValue(school.id);
    this.getClazzBySchoolId(school.id);
    this.getTermsBySchoolId(school.id);
  }

  onKlassChange(klassId: number) {
    this.course.clazz_id = klassId;
    this.formGroups[0].get('klassId')?.setValue(klassId);
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

  // onSoryChange() {
  //   this.userService.getUserWhenSoryChange(this.course.school_id, this.course.clazz_id)
  //     .subscribe(users => {
  //       this.users = users;
  //     }, error => {
  //       console.error('获取用户失败', error);
  //     });
  // }

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

  onSelectionChange(event: MatSelectChange): void {
    this.formGroups[0].get('week')?.setValue([]);
    (event.value as number[]).forEach((value)=> {
      (this.formGroups[0].get('week')!.value as number[]).push(value);
    });
  }

  onChange(formGroupEvent: Event) {
  }
}
