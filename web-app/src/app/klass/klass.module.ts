import {NgModule} from '@angular/core';
import {IndexComponent} from './index/index.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AddComponent} from './add/add.component';
import {CommonModule} from '@angular/common';
import {EditComponent} from './edit/edit.component';
import { SchoolSelectComponent } from './school-select/school-select.component';
import {KlassRoutingModule} from './klass-routing.module';
import {School} from '../norm/entity/School';
import {MatDialogModule} from '@angular/material/dialog';
import {CoreModule} from '../core/core.module';

/**
 * 班级模块
 */
@NgModule({
  declarations: [IndexComponent, AddComponent, EditComponent, SchoolSelectComponent],
  exports: [
    SchoolSelectComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    KlassRoutingModule,
    MatDialogModule,
    CoreModule
  ]
})
export class KlassModule {
}
