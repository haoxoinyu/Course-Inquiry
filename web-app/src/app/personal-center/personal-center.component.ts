import { Component, OnInit } from '@angular/core';
import {User} from '../norm/entity/User';
import {UserService} from '../service/user.service';

@Component({
  selector: 'app-personal-center',
  templateUrl: './personal-center.component.html',
  styleUrls: ['./personal-center.component.sass']
})
export class PersonalCenterComponent implements OnInit {
  /** 绑定到V层 */
  public user: User;
  constructor(private userService: UserService) { }

  ngOnInit() {
    // 调用M层的相关方法
    this.userService.me().subscribe((user) => {
      this.user = user;
    });
  }

}
