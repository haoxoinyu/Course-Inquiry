import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.sass']
})
export class SelectComponent implements OnInit {

  /* 所有对象 */
  objects?: Select[];

  /* 选中的对象 */
  objectSelect!: FormControl;

  @Output() selected = new EventEmitter<Select>();
  @Input() set object(obj: Select) {
    this.objectSelect = new FormControl(obj);
  }
  @Input() url: string | undefined;

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
    if (this.url) {
      this.httpClient.get<Select[]>(this.url).subscribe(
        (objects: Select[]) => {
          this.objects = objects;
        },
        (error) => {
          console.error('Error fetching objects:', error);
        }
      );
    } else {
      console.error('URL is not provided');
    }
  }

  /**
   * 比较函数，标识用哪个字段来比较两个对象是否为同一个对象
   * @param t1 源
   * @param t2 目标
   */
  compareFn(t1: Select, t2: Select) {
    return t1 && t2 ? t1.id === t2.id : t1 === t2;
  }

  /**
   * 触发选择事件
   */
  onChange() {
    this.selected.emit(this.objectSelect?.value);
  }

}

/**
 * 选择对象模型
 */
export class Select {
  constructor(public id: number, public name: string) { }
}
