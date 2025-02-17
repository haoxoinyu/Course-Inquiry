import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './index/index.component';
import { AddComponent } from './add/add.component';
import {MyCourseRoutingModule} from "./my-course-routing.module";
import { CreateComponent } from './create/create.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SoryPipe} from "../norm/sory.pipe";
import {KlassModule} from "../klass/klass.module";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import { MultipulformComponentComponent } from './multipulform-component/multipulform-component.component';

@NgModule({
  declarations: [
    IndexComponent,
    AddComponent,
    CreateComponent,
    SoryPipe,
    MultipulformComponentComponent
  ],
    imports: [
        CommonModule,
        MyCourseRoutingModule,
        FormsModule,
        KlassModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatOptionModule,
        MatSelectModule,
    ],
  exports: [SoryPipe]
})
export class MyCourseModule { }
