import { NgModule } from '@angular/core';
import {PersonalCenterComponent} from "./personal-center.component";
import {ChangePasswordComponent} from "./change-password/change-password.component";
import {SexPipe} from "../norm/sex.pipe";
import {RolePipe} from "../norm/role.pipe";
import {StatePipe} from "../norm/state.pipe";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {RouterModule} from "@angular/router";
import {MatDialogModule} from "@angular/material/dialog";
import {CommonModule} from "@angular/common";
import {PersonalCenterRoutingModule} from "./personal-center-routing.module";
import { RoleChangeComponent } from './role-change/role-change.component';

@NgModule({
  declarations: [
    ChangePasswordComponent,
    PersonalCenterComponent,
    SexPipe,
    RolePipe,
    StatePipe,
    RoleChangeComponent
  ],
  imports: [
    CommonModule,
    PersonalCenterRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
    MatDialogModule
  ],
  exports: [SexPipe, RolePipe, StatePipe]
})
export class PersonalCenterModule { }
