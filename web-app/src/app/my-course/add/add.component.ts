import {Component, Inject, OnInit} from '@angular/core';
import {Term} from "../../norm/entity/Term";
import {Course} from "../../norm/entity/Course";
import {User} from "../../norm/entity/User";
import {HttpClient} from "@angular/common/http";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SweetAlertService} from "../../service/sweet-alert.service";
import {CourseService} from "../../service/course.service";
import {TermService} from "../../service/term.service";
import {UserService} from "../../service/user.service";
import {MyCourseService} from "../../service/my-course.service";
import {School} from "../../norm/entity/School";
import {CourseUser} from "../../norm/entity/CourseUser";

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.sass']
})
export class AddComponent implements OnInit{
  terms = new Array<Term>();
  me?: User;
  clazzId?: number;

  courseUser = {
    user_id: null,
    term_id: null as unknown as number,
    sory: '0',
    course_id: null as unknown as number,
  };
  newCourseUser?: CourseUser;

  courses = new Array<Course>();
  uncourses = new Array<Course>();

  constructor(public dialogRef: MatDialogRef<AddComponent>,
              private termService: TermService,
              private userService: UserService,
              private sweetAlertService: SweetAlertService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private myCourseService: MyCourseService) { }

  ngOnInit() {
    this.userService.me().subscribe((user) => {
      this.me = user;
      console.log(user);
      this.getTermsBySchoolId();
    });
  }

  onSubmit(): void {
    this.newCourseUser = {
      userId: Number(this.me?.id),
      courseId: Number(this.courseUser.course_id),
    }
    console.log(this.newCourseUser);
    this.myCourseService.save(this.newCourseUser).subscribe((data: any) => {
      if (data.message === "该课程已存在") {
        this.sweetAlertService.showError('新增失败', '该课程已存在', 'error');
      } else if (data.message === "与已有课程时间冲突") {
        this.sweetAlertService.showError('新增失败', '与已有课程时间冲突', 'error');
      } else {
        this.dialogRef.close();
        this.sweetAlertService.showSuccess('新增成功', "success");
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
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
    this.courseUser.term_id = termId;
    console.log(this.courseUser.term_id);
    this.getUnCoursesByTermId(termId);
    this.getCoursesByTermId(termId);
  }

  getUnCoursesByTermId(termId: number) {
    const params = {
      termId: termId,
      sory: 0
    }
    this.myCourseService.getCoursesByTermId(params)
      .subscribe(courses => {
        this.uncourses = courses;
      }, error => {
        console.error('获取课程失败', error);
      });
  }

  getCoursesByTermId(termId: number) {
    const params = {
      termId: termId,
      sory: 1
    }
    this.myCourseService.getCoursesByTermId(params)
      .subscribe(courses => {
        this.courses = courses;
      }, error => {
        console.error('获取课程失败', error);
      });
  }
}
