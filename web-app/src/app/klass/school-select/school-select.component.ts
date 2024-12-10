import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {School} from '../../norm/entity/School';
import {FormControl} from '@angular/forms';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-school-select',
  templateUrl: './school-select.component.html',
  styleUrls: ['./school-select.component.sass']
})
export class SchoolSelectComponent implements OnInit {
  /*所有学校*/
  schools: Array<School>;

  schoolSelect: FormControl;

  @Output() selected = new EventEmitter<School>();
  @Input() school: { id: number };

  constructor(private httpClient: HttpClient) {
  }


  /**
   * 获取所有的学校，并传给V层
   */
  ngOnInit() {
    this.schoolSelect = new FormControl(this.school);
    const url = 'http://localhost:8080/School';
    this.httpClient.get(url)
      .subscribe((schools: Array<School>) => {
        this.schools = schools;
      });
  }

  /**
   * 比较函数，标识用哪个字段来比较两个学校是否为同一个学校
   * @param t1 源
   * @param t2 目标
   */
  compareFn(t1: School, t2: School) {
    return t1 && t2 ? t1.id === t2.id : t1 === t2;
  }

  onChange() {
    this.selected.emit(this.schoolSelect.value);
  }
}
