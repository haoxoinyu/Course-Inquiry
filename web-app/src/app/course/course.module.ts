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

@NgModule({
  declarations: [AddComponent, UserMultipleSelectComponent, IndexComponent, EditComponent],
  imports: [
    CommonModule,
    CourseRoutingModule,
    ReactiveFormsModule,
    UserModule,
    CoreModule,
    FormsModule
  ]
})
export class CourseModule { }
