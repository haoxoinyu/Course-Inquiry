import {DebugElement} from '@angular/core';
import {ComponentFixture} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

/**
 * 表单测试
 */
export class FormTest<T> {
  private readonly fixture: ComponentFixture<T>;

  constructor(fixture: ComponentFixture<T>) {
    this.fixture = fixture;
  }
  /**
   * 设置input的值
   * @param fixture 夹具
   * @param cssSelector CSS选择器
   * @param value 要设置的值
   * @return 成功true 失败false
   */
  static setInputValue(fixture: ComponentFixture<any>, cssSelector: string, value: string): boolean {
    const selectorElement = this.getSelectorElement(fixture, cssSelector);
    if (!selectorElement) {
      throw new Error(`未找到css选器${cssSelector}对应的html元素`);
    }
    const htmlInputElement: HTMLInputElement = selectorElement.nativeElement;
    htmlInputElement.value = value;
    htmlInputElement.dispatchEvent(new Event('input'));
    return true;
  }

  /**
   * 获取button按钮，并点击
   * @param fixture 夹具
   * @param cssSelector CSS选择器
   * @return 成功true 失败false
   */
  static clickButton(fixture: ComponentFixture<any>, cssSelector: string): boolean {
    const selectorElement = this.getSelectorElement(fixture, cssSelector);
    if (!selectorElement) {
      throw new Error(`未找到css选器${cssSelector}对应的html元素`);
    }
    const htmlButtonElement: HTMLButtonElement = selectorElement.nativeElement;
    htmlButtonElement.click();
    return true;
  }

  /**
   * 根据CSS选择器来获取夹具中Debug元素
   * @param fixture 夹具
   * @param cssSelector CSS选择器
   * @return DebugElement
   */
  static getSelectorElement(fixture: ComponentFixture<any>, cssSelector: string): DebugElement {
    const debugElement: DebugElement = fixture.debugElement;
    return debugElement.query(By.css(cssSelector));
  }

  /**
   * 设置input输入的值
   * @param cssSelector CSS选择器
   * @param value 值
   */
  setInputValue(cssSelector: string, value: string): boolean {
    return FormTest.setInputValue(this.fixture, cssSelector, value);
  }

  /**
   * 点击某个按钮
   * @param cssSelector CSS选择器
   */
  clickButton(cssSelector: string): boolean {
    return FormTest.clickButton(this.fixture, cssSelector);
  }

}
