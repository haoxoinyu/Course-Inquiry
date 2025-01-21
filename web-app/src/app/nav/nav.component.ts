import {Component, OnInit} from '@angular/core';
import {UserService} from '../service/user.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.sass']
})
export class NavComponent implements OnInit {
  /*标题*/
  title: string | undefined;
  /*菜单项*/
  menus = new Array<{ url: string; name: string }>();

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.title = '教务管理系统';
    this.menus.push({url: 'user', name: '用户管理'});
    this.menus.push({url: 'klass', name: '班级管理'});
    this.menus.push({url: 'school', name: '学校管理'});
    this.menus.push({url: 'term', name: '学期管理'});
    this.menus.push({url: 'course', name: '课程管理'});
    this.menus.push({url: 'myCourse', name: '我的课程'});
    this.menus.push({url: 'courseSchedule', name: '课程查询'});
    this.menus.push({url: 'school', name: '行程查询'});
    this.menus.push({url: 'personalCenter', name: '个人中心'});
  }

  onLogout() {
    this.userService.logout()
      .subscribe(() => {
        this.userService.setIsLogin(false);
      });
  }

}
