import { Component } from '@angular/core';
import {User} from "../../norm/entity/User";

@Component({
  selector: 'app-role-change',
  templateUrl: './role-change.component.html',
  styleUrls: ['./role-change.component.sass']
})
export class RoleChangeComponent {
  id?: number;
  users = new Array<User>();
  me?: User;
  user?: User;
  roleData = {
    userChangedId: null,
    userId: null,
  };

  constructor() {}

  ngOnInit(): void {

  }

  onSubmit() {
  }

  getUser() {

  }

  onNoClick(): void {
  }
}
