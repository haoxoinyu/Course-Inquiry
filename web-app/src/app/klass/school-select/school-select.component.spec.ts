import {async, ComponentFixture, flush, TestBed} from '@angular/core/testing';

import {SchoolSelectComponent} from './school-select.component';
import {BrowserModule, By} from '@angular/platform-browser';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {School} from '../../norm/entity/School';

describe('SchoolSelectComponent', () => {
  let component: SchoolSelectComponent;
  let fixture: ComponentFixture<SchoolSelectComponent>;
  const schools = new Array(new School(1, 'panjie'),
    new School(2, 'zhangxishuo'));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SchoolSelectComponent],
      imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientTestingModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /*断言发请了后台请求，模拟返回数据后，断言V层的select个数为2*/
  it('获取学校列表后选择学校', () => {
    expectInit();

    const htmlSelectElement: HTMLSelectElement = fixture.debugElement.query(By.css('#schoolSelect')).nativeElement;
    expect(htmlSelectElement.length).toBe(2);
    testOptionValue(htmlSelectElement);
  });

  /**
   * 断言option的值与school中name的相同
   * 循环schools数组。断言与option的值一一相等
   * @param htmlSelectElement html元素
   */
  const testOptionValue = (htmlSelectElement: HTMLSelectElement) => {
    const htmlOptionElements: HTMLCollectionOf<HTMLOptionElement> = htmlSelectElement.options;
    for (let i = 0; i < schools.length; i++) {
      const htmlOptionElement: HTMLOptionElement = htmlOptionElements.item(i);
      console.log(htmlOptionElement.text);
      expect(htmlOptionElement.text).toEqual(schools[i].name);
    }
  };


  /**
   * 1. 模拟返回数据给学校列表
   * 2. 观察弹射器
   * 3. 模拟点击第0个option
   * 4. 断言观察到的数据是学校列表的第一个学校
   */
  it('测试组件弹射器', () => {
    expectInit();

    component.selected.subscribe((school: School) => {
      console.log('data emit', school);
      expect(school.name).toEqual(schools[0].name);
    });

    const htmlSelectElement: HTMLSelectElement = fixture.debugElement.query(By.css('#schoolSelect')).nativeElement;
    htmlSelectElement.value = htmlSelectElement.options[0].value;
    htmlSelectElement.dispatchEvent(new Event('change'));
    fixture.detectChanges();
  });

  /**
   * 断言组件进行了初始化
   * 访问了正确的后台地址
   */
  const expectInit = () => {
    const httpTestingController: HttpTestingController = TestBed.get(HttpTestingController);
    const req = httpTestingController.expectOne('http://localhost:8080/School');
    expect(req.request.method).toEqual('GET');
    req.flush(schools);
    fixture.detectChanges();
  };
});
