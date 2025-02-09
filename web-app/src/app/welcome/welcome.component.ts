import { Component, OnInit } from '@angular/core';
import {UserService} from "../service/user.service";
import {SweetAlertService} from "../service/sweet-alert.service";

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.sass']
})
export class WelcomeComponent implements OnInit {

  constructor(private userService: UserService,
              private sweetAlertService: SweetAlertService) { }

  ngOnInit() {
    this.userService.me().subscribe((user) => {
      if (user.state === 2) {
        this.sweetAlertService.returnLogin();
      }
    });
  }

}
