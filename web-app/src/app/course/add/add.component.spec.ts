import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {AddComponent} from './add.component';
import {ReactiveFormsModule} from '@angular/forms';
import {UserMultipleSelectComponent} from '../user-multiple-select/user-multiple-select.component';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {MultipleSelectComponent} from "../../core/multiple-select/multiple-select.component";
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SchoolSelectComponent } from 'src/app/klass/school-select/school-select.component';
import { RESOURCE_CACHE_PROVIDER } from '@angular/platform-browser-dynamic';
import { KlassModule } from 'src/app/klass/klass.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CoreModule } from 'src/app/core/core.module';

describe('course -> AddComponent', () => {
  let component: AddComponent;
  let fixture: ComponentFixture<AddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AddComponent,
        UserMultipleSelectComponent,
        MultipleSelectComponent,
        SchoolSelectComponent
      ],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        MatDialogModule,
        MatSelectModule,
        MatFormFieldModule,
        FormsModule,
        BrowserAnimationsModule,
        KlassModule,
        CoreModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
      teardown: {
        destroyAfterEach: false
      }
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();

  });

});
