import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseScheduleComponent } from './course-schedule.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {KlassModule} from "../klass/klass.module";

@NgModule({
  declarations: [CourseScheduleComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    KlassModule
  ]
})
export class CourseScheduleModule { }
