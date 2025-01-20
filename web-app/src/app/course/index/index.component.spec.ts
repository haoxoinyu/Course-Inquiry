import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IndexComponent } from './index.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import { MatDialogModule } from '@angular/material/dialog';
import { KlassModule } from 'src/app/klass/klass.module';
import { SchoolSelectComponent } from 'src/app/klass/school-select/school-select.component';

fdescribe('course IndexComponent', () => {
  let component: IndexComponent;
  let fixture: ComponentFixture<IndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndexComponent, SchoolSelectComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        MatDialogModule,
        KlassModule
      ],
      teardown: {
        destroyAfterEach: false
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('should create', () => {
    expect(component).toBeTruthy();
    fixture.detectChanges();
  });
});
