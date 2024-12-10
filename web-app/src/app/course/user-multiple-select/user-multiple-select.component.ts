import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Observable} from 'rxjs';
import {User} from '../../norm/entity/User';
import {UserService} from '../../service/user.service';

@Component({
  selector: 'app-user-multiple-select',
  templateUrl: './user-multiple-select.component.html',
  styleUrls: ['./user-multiple-select.component.sass']
})
export class UserMultipleSelectComponent implements OnInit {
  useres$: Observable<User[]>;

  @Output()
  changed = new EventEmitter<User[]>();

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.useres$ = this.userService.all();
  }

  onChange($event: Array<User>) {
    this.changed.emit($event);
  }
}
