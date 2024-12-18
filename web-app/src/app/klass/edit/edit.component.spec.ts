import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {EditComponent} from './edit.component';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {ActivatedRouteStub} from './activated-route-stub';
import {Klass} from '../../norm/entity/Klass';
import {FormTest} from '../../testing/FormTest';
import SpyObj = jasmine.SpyObj;


describe('klass EditComponent', () => {
  let component: EditComponent;
  let fixture: ComponentFixture<EditComponent>;
  beforeEach(async(() => {
    const routerSpy = jasmine.createSpyObj<Router>('Router', ['navigateByUrl']);

    TestBed.configureTestingModule({
      declarations: [EditComponent],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        {provide: ActivatedRoute, useClass: ActivatedRouteStub},
        {provide: Router, useValue: routerSpy}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

});

