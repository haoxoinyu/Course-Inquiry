import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleComponent } from './schedule.component';
import { SchoolRoutingModule } from '../school/school-routing.module';
import { ScheduleRoutingModule } from './schedule-routing.moudle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ScheduleComponent
  ],
  imports: [
    CommonModule,
    ScheduleRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class ScheduleModule { }
