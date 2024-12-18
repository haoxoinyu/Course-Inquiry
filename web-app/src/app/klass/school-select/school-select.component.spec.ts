import {async, ComponentFixture, flush, TestBed} from '@angular/core/testing';

import {SchoolSelectComponent} from './school-select.component';
import {BrowserModule, By} from '@angular/platform-browser';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {School} from '../../norm/entity/School';
import {SelectComponent} from "../../core/select/select.component";

describe('SchoolSelectComponent', () => {
  let component: SchoolSelectComponent;
  let fixture: ComponentFixture<SchoolSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SchoolSelectComponent, SelectComponent],
      imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientTestingModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {})
});
