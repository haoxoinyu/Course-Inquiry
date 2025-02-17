import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { CourseScheduleComponent } from './course-schedule/course-schedule.component';
const routes: Routes = [
  {
    path: '',
    component: IndexComponent
  },
  {
    path: 'course',
    component: CourseScheduleComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CourseRoutingModule { }
