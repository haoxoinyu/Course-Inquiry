import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TermRoutingModule } from './term-routing.module';
import { IndexComponent } from './index/index.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [IndexComponent, AddComponent, EditComponent],
  imports: [
    CommonModule,
    TermRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class TermModule { }
