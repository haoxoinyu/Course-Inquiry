import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {WelcomeComponent} from './welcome/welcome.component';
import {LoginComponent} from "./login/login.component";
import {CourseScheduleComponent} from "./course-schedule/course-schedule.component";
import { scheduled } from 'rxjs';

const routes: Routes = [
  {
    path: '',
    component: WelcomeComponent
  },
  {
    path: 'personalCenter',
    loadChildren: () => import('./personal-center/personal-center.module').then(m => m.PersonalCenterModule)
  },
  {
    path: 'schedule',
    loadChildren: () => import('./schedule/schedule.module').then(schedule => schedule.ScheduleModule)
  },
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then(m => m.UserModule)
  },
  {
    path: 'klass',
    loadChildren: () => import('./klass/klass.module').then(mod => mod.KlassModule)
  },
  {
    path: 'school',
    loadChildren: () => import('./school/school.module').then(mod => mod.SchoolModule)
  },
  {
    path: 'term',
    loadChildren: () => import('./term/term.module').then(mod => mod.TermModule)
  },
  {
    path: 'course',
    loadChildren: () => import('./course/course.module').then(mod => mod.CourseModule)
  },
  {
    path: 'courseSchedule',
    component: CourseScheduleComponent
  },
  {
    path: 'myCourse',
    loadChildren: () => import('./my-course/my-course.module').then(mod => mod.MyCourseModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: []
})
export class AppRoutingModule {
}
