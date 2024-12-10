import {School} from './School';

/**
 * 班级实体
 */
export class Klass {
  id: number;
  name: string;
  school: School;

  /**
   * 构造函数
   * @param id id
   * @param name 名称
   * @param school 学校
   */
  constructor(id: number, name: string, school: School) {
    this.id = id;
    this.name = name;
    this.school = school;
  }
}
