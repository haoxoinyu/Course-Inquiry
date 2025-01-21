import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './index/index.component';
import { AddComponent } from './add/add.component';
import {MyCourseRoutingModule} from "./my-course-routing.module";
import { CreateComponent } from './create/create.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SoryPipe} from "../norm/sory.pipe";
import {KlassModule} from "../klass/klass.module";

@NgModule({
  declarations: [
    IndexComponent,
    AddComponent,
    CreateComponent,
    SoryPipe
  ],
    imports: [
        CommonModule,
        MyCourseRoutingModule,
        FormsModule,
        KlassModule,
        ReactiveFormsModule,
    ],
  exports: [SoryPipe]
})
export class MyCourseModule { }
