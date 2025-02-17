import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
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

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.sass']
})
export class CreateComponent implements OnInit {
  course = {
    name: '',
    school_id: null as unknown as number,
    term_id: null as unknown as number,
    clazz_id: null as unknown as number,
    user_id: null as unknown as number,
    sory: 0,
    week: [],
    day: null as unknown as number,
    period: null as unknown as number
  };

  formGroups: FormGroup[] = [];

  value = '';
  schools = new Array<School>();
  terms = new Array<Term>();
  term = new Term(1, '', new School(1, ''), new Date(), new Date());
  me?: User;

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

  constructor(private httpClient: HttpClient,
              public dialogRef: MatDialogRef<CreateComponent>,
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
    if(this.data !== undefined) {
      this.formGroups[0].get('day')?.setValue(this.data.date);
      this.formGroups[0].get('period')?.setValue(this.data.section);
    }
    this.formGroups[0].get('termId')?.setValue(this.data.termId);
    this.userService.me().subscribe((user) => {
      this.me = user;
      console.log(user);
      this.getTermsBySchoolId();
    });
  }

  addForm() {
    const formGroup = new FormGroup({
      name: new FormControl('', Validators.required),
      schoolId: new FormControl(0),
      termId: new FormControl(this.data.termId, Validators.required),
      userId: new FormControl([] as number[]),
      klassId: new FormControl(0),
      sory: new FormControl(0, Validators.required),
      week: new FormControl([] as number[], Validators.required),
      day: new FormControl(this.data.date, Validators.required),
      period: new FormControl(this.data.section, Validators.required)
    })
    this.formGroups.push(formGroup);
  }

  onSubmit(): void {
    this.formGroups.forEach((formGroup) => {
      const newCourse = {
        name: formGroup.get('name')!.value,
        sory: formGroup.get('sory')!.value,
        week: formGroup.get('week')!.value!,
        day: formGroup.get('day')!.value,
        period: formGroup.get('period')!.value,
        schoolId: this.me?.klass?.school?.id,
        clazz_id: this.me?.klass?.id,
        term_id: formGroup.get('termId')!.value,
        userId: [this.me?.id!]
      }
      this.courseService.add(newCourse)
        .subscribe((data: any )=> {
            if (data.message === '课程名称长度最小为2位') {
              this.sweetAlertService.showError('添加失败', '课程名称长度最小为2位', 'error');
            } else if (data.message === '与已有课程的时间冲突') {
              this.sweetAlertService.showError('添加失败', '与已有课程的时间冲突', 'error');
            } else {
              this.dialogRef.close(newCourse);
              this.sweetAlertService.showSuccess('添加成功！', 'success');
            }
          },
          error => {
            console.log(error.error.message);
            this.sweetAlertService.showError('添加失败', '', 'error');
            console.log('保存失败', error);
          });
    })
  
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

// 使用 getter 方法来检查所有表单组是否有效

get checkAllFormGroups(): boolean {

  return this.formGroups.every(formGroup => formGroup.valid);

}

  getTermsBySchoolId() {
    this.termService.getTermsBySchoolId(Number(this.me?.klass?.school?.id))
      .subscribe((data) => {
        this.terms = data.content;
      }, (error: any) => {
        console.error('获取学期失败', error);
      });
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
  onChange(formGroupEvent: Event) {
  }
}
