import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseRoutingModule } from './course-routing.module';
import { AddComponent } from './add/add.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { UserMultipleSelectComponent } from './user-multiple-select/user-multiple-select.component';
import {CoreModule} from '../core/core.module';
import { IndexComponent } from './index/index.component';
import { EditComponent } from './edit/edit.component';
import { KlassModule } from '../klass/klass.module';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MyCourseModule} from "../my-course/my-course.module";
import { CourseScheduleComponent } from './course-schedule/course-schedule.component';

@NgModule({
  declarations: [
    AddComponent,
    UserMultipleSelectComponent,
    IndexComponent,
    EditComponent,
    CourseScheduleComponent
  ],
  imports: [
    CommonModule,
    CourseRoutingModule,
    ReactiveFormsModule,
    CoreModule,
    FormsModule,
    KlassModule,
    MatSelectModule,
    MatFormFieldModule,
    MyCourseModule
  ]
})
export class CourseModule { }
