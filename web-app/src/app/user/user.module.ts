import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { IndexComponent } from './index/index.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {KlassModule} from "../klass/klass.module";
import {PersonalCenterModule} from "../personal-center/personal-center.module";


@NgModule({
  declarations: [IndexComponent, AddComponent, EditComponent],
    imports: [
        CommonModule,
        UserRoutingModule,
        FormsModule,
        KlassModule,
        PersonalCenterModule,
        ReactiveFormsModule,
    ]
})
export class UserModule { }
