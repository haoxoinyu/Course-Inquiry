import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {UserService} from '../service/user.service';
import {SweetAlertService} from "../service/sweet-alert.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {
  formGroup: FormGroup | undefined;

  constructor(private userService: UserService,
              private sweetAlertService: SweetAlertService,) { }

  ngOnInit() {
    this.formGroup = new FormGroup({
      username: new FormControl(''),
      password: new FormControl('')
    });
  }

  /**
   * 点击提交按钮后进行用户登录
   */
  onSubmit() {
    const username = this.formGroup?.get('username')!.value;
    const password = this.formGroup?.get('password')!.value;
    this.userService.login(username, password).subscribe(result => {
      if (result.message === "用户已被冻结") {
        this.sweetAlertService.showInfo();
      } else if (result.message === "用户名或密码不正确") {
        this.sweetAlertService.showError('登录失败', '用户名密码错误', 'error');
      }
      else {
        this.sweetAlertService.showSuccess('登录成功', 'success');
        this.userService.setIsLogin(true);
      }
    });
  }

}
