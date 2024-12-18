import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {School} from '../../norm/entity/School';

@Component({
  selector: 'app-school-select',
  templateUrl: './school-select.component.html',
  styleUrls: ['./school-select.component.sass']
})
export class SchoolSelectComponent implements OnInit {

  @Output() selected = new EventEmitter<School>();
  @Input() school: School;
  url = 'http://localhost:8080/School/list';

  constructor() {
  }

  ngOnInit() {
  }

  onSelected(school: School): void {
    console.log(school);
    this.selected.emit(school);
  }

}
