import {Component, EventEmitter, forwardRef, Input, OnInit, Output} from '@angular/core';
import {School} from '../../norm/entity/School';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'app-school-select',
  templateUrl: './school-select.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SchoolSelectComponent),
      multi: true
    }
  ],
  styleUrls: ['./school-select.component.sass']
})
export class SchoolSelectComponent implements ControlValueAccessor,OnInit {

  @Output() selected = new EventEmitter<School>();
  @Input() set school(value: School) {
    if (value) {
      this.selected.emit(value);
    }
  }
  url = 'http://localhost:8080/School/list';

  value?: number;

  onChange: any = () => {};
  onTouched: any = () => {};
  constructor() {
  }

  ngOnInit() {
  }

  onSelected(school: School): void {
    console.log(school);
    this.selected.emit(school);
  }

  writeValue(value: number): void {
    if (value !== undefined) {
      this.value = value;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

}
