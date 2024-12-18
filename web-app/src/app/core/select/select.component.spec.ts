import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {Select, SelectComponent} from './select.component';
import {BrowserModule, By} from '@angular/platform-browser';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

describe('core select SelectComponent', () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<SelectComponent>;
  const url = 'http://localhost:8080/test';
  const objects = new Array(new Select(1, '潘杰'), new Select(2, '张喜硕'));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectComponent],
      imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientTestingModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectComponent);
    component = fixture.componentInstance;
    component.url = url;
    fixture.detectChanges();
  });


  /**
   * 1. 模拟返回数据给教师列表
   * 2. 观察弹射器
   * 3. 模拟点击第0个option
   * 4. 断言观察到的数据是教师列表的第一个教师
   */
  it('测试组件弹射器', () => {
    expectInit();

    component.selected.subscribe((object: Select) => {
      console.log('data emit', object);
      expect(object.name).toEqual(objects[0].name);
    });

    const htmlSelectElement: HTMLSelectElement = fixture.debugElement.query(By.css('#objectSelect')).nativeElement;
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
    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush(objects);
    fixture.detectChanges();
  };
});
