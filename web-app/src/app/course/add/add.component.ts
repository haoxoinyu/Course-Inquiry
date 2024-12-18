import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Course } from '../../norm/entity/Course';
import { User } from '../../norm/entity/User';
import { CourseService } from '../../service/course.service';
import { UniqueNameValidator } from '../validator/unique-name-validator';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.sass']
})
export class AddComponent implements OnInit {
  formGroup: FormGroup;
  course: Course;

  constructor(private formBuilder: FormBuilder,
              private courseService: CourseService,
              private uniqueNameValidator: UniqueNameValidator) {
    // 初始化 formGroup 和 course
    this.formGroup = this.formBuilder.group({
      name: ['', [Validators.minLength(2), Validators.required], this.uniqueNameValidator.validate]
    });
    this.course = new Course();
  }

  ngOnInit() {
    // 无需再次初始化 formGroup 和 course
  }

  onSubmit() {
    // 使用非空断言操作符确保 formGroup 和 course 不是 undefined
    const name = this.formGroup.get('name')?.value;
    if (name) {
      this.course.name = name;
      this.courseService.save(this.course).subscribe((course) => {
        console.log(course);
      });
    } else {
      console.error('Name is required');
    }
  }

  onUserChange($event: User[]) {
    // 检查 $event 是否是 undefined
    if ($event) {
      this.course.users = $event;
    } else {
      console.error('Users are not selected');
    }
  }
}
