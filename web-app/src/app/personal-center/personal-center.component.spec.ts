import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalCenterComponent } from './personal-center.component';
import {of} from 'rxjs';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {SexPipe} from "../norm/sex.pipe";
import {RolePipe} from "../norm/role.pipe";
import {StatePipe} from "../norm/state.pipe";

describe('PersonalCenterComponent', () => {
  let component: PersonalCenterComponent;
  let fixture: ComponentFixture<PersonalCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalCenterComponent, SexPipe, RolePipe, StatePipe],
      imports: [HttpClientTestingModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
