import { DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

/**
 * 表单测试
 */
export class FormTest<T> {
  private readonly fixture: ComponentFixture<T>;

  constructor(fixture: ComponentFixture<T>) {
    this.fixture = fixture;
  }

  /**
   * 获取input输入框的值
   * @param cssSelector CSS选择器
   * @return string input的值，如果未找到该元素返回null
   */
  static getInputValueByFixtureAndCss(fixture: ComponentFixture<any>, cssSelector: string): string | null {
    const debugElement: DebugElement = fixture.debugElement;
    const inputElement = debugElement.query(By.css(cssSelector));
    return inputElement ? inputElement.nativeElement.value : null;
  }

  /**
   * 设置input的值
   * @param cssSelector CSS选择器
   * @param value 要设置的值
   * @return 成功true 失败false
   */
  static setInputValue(fixture: ComponentFixture<any>, cssSelector: string, value: string): boolean {
    const selectorElement = this.getSelectorElement(fixture, cssSelector);
    if (!selectorElement) {
      return false;
    }
    const htmlInputElement: HTMLInputElement = selectorElement.nativeElement;
    htmlInputElement.value = value;
    htmlInputElement.dispatchEvent(new Event('input'));
    return true;
  }

  /**
   * 获取button按钮，并点击
   * @param cssSelector CSS选择器
   * @return 成功true 失败false
   */
  static clickButton(fixture: ComponentFixture<any>, cssSelector: string): boolean {
    const selectorElement = this.getSelectorElement(fixture, cssSelector);
    if (!selectorElement) {
      return false;
    }
    const htmlButtonElement: HTMLButtonElement = selectorElement.nativeElement;
    htmlButtonElement.click();
    return true;
  }

  /**
   * 根据CSS选择器来获取夹具中Debug元素
   * @param cssSelector CSS选择器
   * @return DebugElement
   */
  private static getSelectorElement(fixture: ComponentFixture<any>, cssSelector: string): DebugElement | null {
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
