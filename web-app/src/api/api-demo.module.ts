import { NgModule } from '@angular/core';
import {MockApiInterceptor} from '@yunzhi/ng-mock-api';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {TermApi} from './term-api';
import {LoginApi} from './login-api';
import { CourseApi } from './course-api';

export const api = [
  TermApi,
  LoginApi,
  CourseApi
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS, useClass: MockApiInterceptor.forRoot(api), multi: true
    },
  ]
})
export class ApiDemoModule { }
