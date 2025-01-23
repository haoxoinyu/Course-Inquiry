import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IndexComponent } from './index.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import { MatDialogModule } from '@angular/material/dialog';
import {SchoolSelectComponent} from "../../klass/school-select/school-select.component";
import {CoreModule} from "../../core/core.module";
import { KlassModule } from 'src/app/klass/klass.module';
import {SoryPipe} from "../../norm/sory.pipe";

describe('course IndexComponent', () => {
  let component: IndexComponent;
  let fixture: ComponentFixture<IndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndexComponent, SchoolSelectComponent, SoryPipe],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        MatDialogModule,
        CoreModule,
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

  it('should create', () => {
    expect(component).toBeTruthy();
    fixture.detectChanges();
  });
});
