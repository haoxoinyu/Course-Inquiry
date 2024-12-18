import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {MultipleSelectComponent} from './multiple-select.component';
import {Subject} from 'rxjs';
import {Course} from '../../norm/entity/Course';
import {By} from '@angular/platform-browser';

describe('MultipleSelectComponent', () => {
  let component: MultipleSelectComponent;
  let fixture: ComponentFixture<MultipleSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MultipleSelectComponent],
      imports: []
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('onChange -> 选中', () => {
    expect(component.selectedObjects.length).toBe(0);
    const course = new Course();
    component.onChange(course);
    expect(component.selectedObjects.length).toBe(1);
    expect(component.selectedObjects[0]).toBe(course);
  });

  it('onChange -> 取消选中', () => {
    const course = new Course();
    component.selectedObjects.push(course);
    expect(component.selectedObjects.length).toBe(1);
    component.onChange(course);
    expect(component.selectedObjects.length).toBe(0);
  });

});
