import { Component, OnInit } from '@angular/core';
import {User} from '../norm/entity/User';
import {UserService} from '../service/user.service';
import {MatDialog} from "@angular/material/dialog";
import {ChangePasswordComponent} from "./change-password/change-password.component";
import {SweetAlertService} from "../service/sweet-alert.service";

@Component({
  selector: 'app-personal-center',
  templateUrl: './personal-center.component.html',
  styleUrls: ['./personal-center.component.sass']
})
export class PersonalCenterComponent implements OnInit {
  /** 绑定到V层 */
  public user: User | undefined;
  public role: number | undefined;
  constructor(private userService: UserService,
              private dialog: MatDialog,
              private sweetAlertService: SweetAlertService) { }

  ngOnInit() {
    // 调用M层的相关方法
    this.userService.me().subscribe((user) => {
      this.user = user;
      this.role = user.role;
      console.log(user);
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ChangePasswordComponent, {
      width: '900px',
      height: '400px',
      data: this.user
    });
  }

}
