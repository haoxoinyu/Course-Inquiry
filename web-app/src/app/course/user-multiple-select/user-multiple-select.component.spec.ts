import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMultipleSelectComponent } from './user-multiple-select.component';
import {User} from '../../norm/entity/User';
import {UserService} from '../../service/user.service';
import {of} from 'rxjs';

describe('UserMultipleSelectComponent', () => {
  let component: UserMultipleSelectComponent;
  let fixture: ComponentFixture<UserMultipleSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserMultipleSelectComponent ],
      providers: [
        UserService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMultipleSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onChange', () => {
    let result;
    component.changed.subscribe((data) => {
      result = data;
    });

    const klasses = [new User(null, null, null)];
    component.onChange(klasses);
    expect(result).toBe(klasses);
  });
});
