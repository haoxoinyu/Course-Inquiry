import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Course} from '../../norm/entity/Course';
import {User} from '../../norm/entity/User';
import {CourseService} from '../../service/course.service';
import {UniqueNameValidator} from '../validator/unique-name-validator';

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
              private uniqueNameValidator: UniqueNameValidator) { }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      name: ['', [Validators.minLength(2), Validators.required],
        this.uniqueNameValidator.validate]
    });
    this.course = new Course();
  }

  onSubmit() {
    this.course.name = this.formGroup.get('name').value;
    this.courseService.save(this.course).subscribe((course) => {
      console.log(course);
    });
  }

  onUserChange($event: User[]) {
    this.course.users = $event;
  }
}
