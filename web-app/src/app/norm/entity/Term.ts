import {School} from './School';

/**
 * 班级实体
 */
export class Term {
  id: number;
  name: string;
  school: School;
  startTime: Date;
  endTime: Date;

  /**
   * 构造函数
   * @param id id
   * @param name 名称
   * @param school 学校
   */
  constructor(id: number, name: string, school: School, startTime: Date, endTime: Date) {
    this.id = id;
    this.name = name;
    this.school = school;
    this.startTime = startTime;
    this.endTime = endTime;
  }
}
