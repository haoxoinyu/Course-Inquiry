import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditComponent } from './edit.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {ActivatedRoute} from "@angular/router";
import {ReactiveFormsModule} from "@angular/forms";

describe('term EditComponent', () => {
  let component: EditComponent;
  let fixture: ComponentFixture<EditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditComponent ],
      imports: [HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule
        ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
