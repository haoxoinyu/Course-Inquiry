import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleChangeComponent } from './role-change.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

describe('RoleChangeComponent', () => {
  let component: RoleChangeComponent;
  let fixture: ComponentFixture<RoleChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleChangeComponent ],
      imports: [HttpClientTestingModule, MatDialogModule, ReactiveFormsModule, FormsModule],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
