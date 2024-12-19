import {Component, Inject, OnInit} from '@angular/core';
import {User} from "../../norm/entity/User";
import {SweetAlertService} from "../../service/sweet-alert.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UserService} from "../../service/user.service";
import {HttpClient} from "@angular/common/http";
import {tap} from "rxjs/operators";

@Component({
  selector: 'app-role-change',
  templateUrl: './role-change.component.html',
  styleUrls: ['./role-change.component.sass']
})
export class RoleChangeComponent implements OnInit {
  id?: number;
  users = new Array<User>();
  me?: User;
  user?: User;
  roleData = {
    userChangedId: null,
    userId: null,
  };
  roleUser?: User;

  constructor(private userService: UserService,
              private httpClient: HttpClient,
              private sweetAlertService: SweetAlertService,
              public dialogRef: MatDialogRef<RoleChangeComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.me = data;
  }

  ngOnInit() {
    console.log('ngOnInit');
    this.userService.all().subscribe(users => {
      this.users = users;
    });
  }

  onSubmit() {
    const url = `http://localhost:8080/User/${this.roleData.userId}`;
    this.httpClient.get(url)
      .subscribe(
        (data: any) => {
          this.roleUser = data;
          this.roleUser!.role = 1;
          console.log(this.roleUser);
          this.updateRole(this.roleUser!.id, this.roleUser)
            .subscribe(
              () => console.log('Role changed successfully'),
              error => console.error('Error changing role', error)
            );
        },
        () => console.log('Request error')
      );
  }

  updateRole(userId: number, user: any) {
    return this.userService.update(userId, user)
      .pipe(
        tap(() => {
          this.me!.role = 2;
          this.userService.update(this.me!.id, this.me)
            .subscribe(
              () => {
                console.log('Role changed successfully');
                this.dialogRef.close();
                this.sweetAlertService.showSuccess('修改成功!', 'success');
                setTimeout(() => this.sweetAlertService.returnLogin(), 1500);
              },
              error => console.error('Error changing role', error)
            );
        })
      );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
