import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddComponent} from './add.component';
import {ReactiveFormsModule} from '@angular/forms';
import {FormTest} from '../../testing/FormTest';
import {By} from '@angular/platform-browser';
import {Klass} from '../../norm/entity/Klass';
import {UserMultipleSelectComponent} from '../user-multiple-select/user-multiple-select.component';
import {CourseService} from '../../service/course.service';
import {Course} from '../../norm/entity/Course';
import {of} from 'rxjs';
import {RouterTestingModule} from '@angular/router/testing';


describe('course -> AddComponent', () => {
  let component: AddComponent;
  let fixture: ComponentFixture<AddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule
      ],
      providers: [
      ]
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

  it('requried校验', () => {
    // 初次渲染页面时，不显示校验信息
    expect(fixture.debugElement.query(By.css('#nameRequired'))).toBeNull();

    // 输入了长度为1的名称，显示校验信息
    const formTest: FormTest<AddComponent> = new FormTest(fixture);
    formTest.setInputValue('#name', '1');
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#nameRequired'))).toBeNull();

    // 删除输入，显示required
    formTest.setInputValue('#name', '');
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#nameRequired'))).toBeDefined();
  });

  it('minLength校验', () => {
    // 输入长度小于2的，显示
    const formTest: FormTest<AddComponent> = new FormTest(fixture);
    formTest.setInputValue('#name', '1');
    expect(fixture.debugElement.query(By.css('#nameMixLength'))).toBeDefined();
  });

  /**
   * 在beforeEach的组件初始化代码中。
   * 当fixture.detectChanges();被首次执行时，会自动执行一次ngOnInit方法
   */
  it('ngOnInit', () => {
    expect(component.formGroup).toBeDefined();
    expect(component.course).toBeDefined();
  });
});
