import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CourseRoutingModule } from './course-routing.module';
import { AddComponent } from './add/add.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { UserMultipleSelectComponent } from './user-multiple-select/user-multiple-select.component';
import {CoreModule} from '../core/core.module';
import { IndexComponent } from './index/index.component';
import { EditComponent } from './edit/edit.component';
import {UserModule} from '../user/user.module';
import { SchoolSelectComponent } from '../klass/school-select/school-select.component';
import { KlassModule } from '../klass/klass.module';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MyCourseModule} from "../my-course/my-course.module";

@NgModule({
  declarations: [
    AddComponent,
    UserMultipleSelectComponent,
    IndexComponent,
    EditComponent
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
