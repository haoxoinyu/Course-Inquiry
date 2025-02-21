import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {EditComponent} from './edit.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {ActivatedRouteStub} from './activated-route-stub';
import {Klass} from '../../norm/entity/Klass';
import {FormTest} from '../../testing/FormTest';
import SpyObj = jasmine.SpyObj;
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {SchoolSelectComponent} from "../school-select/school-select.component";
import {CoreModule} from "../../core/core.module";


describe('klass EditComponent', () => {
  let component: EditComponent;
  let fixture: ComponentFixture<EditComponent>;
  beforeEach(async(() => {
    const routerSpy = jasmine.createSpyObj<Router>('Router', ['navigateByUrl']);

    TestBed.configureTestingModule({
      declarations: [EditComponent, SchoolSelectComponent],
      imports: [
        CoreModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        MatDialogModule
      ],
      providers: [
        {provide: ActivatedRoute, useClass: ActivatedRouteStub},
        {provide: Router, useValue: routerSpy},
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
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
  })
});

