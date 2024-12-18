import {Component, OnInit} from '@angular/core';
import {Course} from '../../norm/entity/Course';
import {Page} from '../../norm/entity/page';
import {FormControl} from '@angular/forms';
import {User} from '../../norm/entity/User';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.sass']
})
export class IndexComponent implements OnInit {
  params = {
    name: new FormControl('')
  };

  coursePage: Page<Course> | undefined;

  constructor() {
  }

  ngOnInit() {
  }

  onQuery() {

  }

  onSelectUser($event: User) {

  }

  onDelete(course: Course) {

  }
}
