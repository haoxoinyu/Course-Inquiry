import {School} from './School';
import {FormControl, FormGroup, ɵFormGroupRawValue, ɵGetProperty, ɵTypedOrUntyped} from '@angular/forms';

/**
 * 班级实体
 */
export class Klass {
  id: number | undefined;
  name?: string | undefined;
  school?: School | undefined;

  /**
   * 构造函数
   * @param id id
   * @param name 名称
   * @param school 学校
   */
  constructor(id: number | undefined, name?: string, school?: School) {
    this.id = id;
    this.name = name;
    this.school = school;
  }
}
