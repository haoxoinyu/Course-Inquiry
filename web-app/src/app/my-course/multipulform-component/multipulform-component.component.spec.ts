import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipulformComponentComponent } from './multipulform-component.component';

describe('MultipulformComponentComponent', () => {
  let component: MultipulformComponentComponent;
  let fixture: ComponentFixture<MultipulformComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultipulformComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultipulformComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
