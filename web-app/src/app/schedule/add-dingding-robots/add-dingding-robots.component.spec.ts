import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDingdingRobotsComponent } from './add-dingding-robots.component';

describe('AddDingdingRobotsComponent', () => {
  let component: AddDingdingRobotsComponent;
  let fixture: ComponentFixture<AddDingdingRobotsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDingdingRobotsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDingdingRobotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
