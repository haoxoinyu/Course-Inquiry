import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {WelcomeComponent} from './welcome/welcome.component';
import {PersonalCenterComponent} from './personal-center/personal-center.component';


const routes: Routes = [
  {
    path: '',
    component: WelcomeComponent
  },
  {
    path: 'personalCenter',
    component: PersonalCenterComponent
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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: []
})
export class AppRoutingModule {
}
