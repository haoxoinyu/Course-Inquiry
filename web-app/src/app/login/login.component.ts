import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {UserService} from '../service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {
  formGroup: FormGroup | undefined;

  constructor(private userService: UserService) { }

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
      if (result) {
        this.userService.setIsLogin(true);
      } else {
        console.log('用户名密码错误');
      }
    });
  }

}
