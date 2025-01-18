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


describe('course -> AddComponent', () => {
  let component: AddComponent;
  let fixture: ComponentFixture<AddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AddComponent, 
        UserMultipleSelectComponent, 
        MultipleSelectComponent
      ],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        MatDialogModule,
        MatSelectModule,
        FormsModule,
        BrowserAnimationsModule
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
