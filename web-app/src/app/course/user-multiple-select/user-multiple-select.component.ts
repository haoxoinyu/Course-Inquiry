import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../norm/entity/User';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-user-multiple-select',
  templateUrl: './user-multiple-select.component.html',
  styleUrls: ['./user-multiple-select.component.sass']
})
export class UserMultipleSelectComponent implements OnInit {
  users$!: Observable<User[]>;

  @Output()
  changed = new EventEmitter<User[]>();

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.users$ = this.userService.all();
  }

  /**
   * 当用户选择发生变化时触发
   * @param $event 用户选择的数组
   */
  onChange($event: User[]) {
    // 发射选择变化事件
    this.changed.emit($event);
  }
}
