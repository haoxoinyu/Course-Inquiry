import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {User} from '../norm/entity/User';
import {School} from "../norm/entity/School";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  /** 数据源 */
  private isLogin: BehaviorSubject<boolean>;

  /** 数据源对应的订阅服务 */
  public isLogin$: Observable<boolean>;
  private isLoginCacheKey = 'isLogin';

  constructor(private httpClient: HttpClient) {
    const isLogin: string = window.sessionStorage?.getItem(this.isLoginCacheKey)!;
    this.isLogin = new BehaviorSubject(this.convertStringToBoolean(isLogin));
    this.isLogin$ = this.isLogin.asObservable();
  }

  /**
   * 用户登录
   * @param username 用户名
   * @param password 密码
   * @return 登录成功:true; 登录失败: false。
   */
  login(username: string, password: string): Observable<boolean> {
    const url = 'http://localhost:8080/User/login';
    return this.httpClient.post<boolean>(url, {username, password});
  }

  /**
   * 设置登录状态
   * @param isLogin 登录状态
   */
  setIsLogin(isLogin: boolean) {
    window.sessionStorage.setItem(this.isLoginCacheKey, this.convertBooleanToString(isLogin));
    this.isLogin.next(isLogin);
  }

  /**
   * 注销
   */
  logout(): Observable<void> {
    const url = 'http://localhost:8080/User/logout';
    return this.httpClient.get<void>(url);
  }

  /**
   * 字符串转换为boolean
   * @param value 字符串
   * @return 1 true; 其它 false
   */
  convertStringToBoolean(value: string) {
    return value === '1';
  }

  /**
   * boolean转string
   * @param value boolean
   * @return '1' true; '0' false;
   */
  convertBooleanToString(value: boolean) {
    return value ? '1' : '0';
  }

  /**
   * 获取当前登录的教师
   */
  me(): Observable<User> {
    const url = 'http://localhost:8080/User/me';
    return this.httpClient.get<User>(url);
  }

  /**
   * 获取所有用户
   */
  all(): Observable<User[]> {
    const httpParams = new HttpParams().append('name', '');
    return this.httpClient.get<User[]>('http://localhost:8080/User', {params: httpParams});
  }

  /**
   * 更新用户
   * @param id id
   * @param user 学校
   */
  update(id: number | undefined, user: User | undefined): Observable<User> {
    const url = `http://localhost:8080/User/${id}`;
    return this.httpClient.put<User>(url, user);
  }
}
