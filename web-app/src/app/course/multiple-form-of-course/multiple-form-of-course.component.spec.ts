import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleFormOfCourseComponent } from './multiple-form-of-course.component';

describe('MultipleFormOfCourseComponent', () => {
  let component: MultipleFormOfCourseComponent;
  let fixture: ComponentFixture<MultipleFormOfCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultipleFormOfCourseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultipleFormOfCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
