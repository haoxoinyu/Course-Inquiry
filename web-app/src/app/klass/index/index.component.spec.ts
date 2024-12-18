import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {IndexComponent} from './index.component';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {Klass} from '../../norm/entity/Klass';
import {User} from '../../norm/entity/User';
import {FormsModule} from '@angular/forms';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';
import {RouterTestingModule} from '@angular/router/testing';

describe('klass -> IndexComponent', () => {
  let component: IndexComponent;
  let fixture: ComponentFixture<IndexComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IndexComponent],
      imports: [HttpClientTestingModule, FormsModule, RouterTestingModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    httpTestingController = TestBed.get(HttpTestingController);
    fixture = TestBed.createComponent(IndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

});
