/**
 * 学校实体
 */
export class School {
  id: number;
  name: string;

  /**
   * 构造函数
   * @param id id
   * @param name 名称
   */
  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}
