import {Klass} from './Klass';

/**
 * 用户
 */
export class User {
  id: number;
  name: string;
  username: string;
  sex: boolean | undefined;
  role: number | undefined;
  state: number | undefined;
  klass: Klass | undefined;

  /**
   * 构造函数
   * @param id id
   * @param username 用户名
   * @param name 姓名
   * @param sex 性别
   * @param role 角色
   * @param state 状态
   */
  constructor(id: number, username: string, name: string, sex?: boolean, role?: number, state?: number, klass?: Klass) {
    this.id = id;
    this.name = name;
    this.username = username;
    this.sex = sex;
    this.role = role;
    this.state = state;
    this.klass = klass;
  }
}
