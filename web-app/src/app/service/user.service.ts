import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {User} from '../norm/entity/User';
import {School} from "../norm/entity/School";
import {map} from "rxjs/operators";
import { Page } from '../norm/entity/page';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  /** 数据源 */
  private isLogin: BehaviorSubject<boolean>;

  /** 数据源对应的订阅服务 */
  public isLogin$: Observable<boolean>;
  private isLoginCacheKey = 'isLogin';
  private currentUserUrl = 'http://localhost:8080/User/me'; // 获取当前登录用户信息的API URL

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

  getCurrentUser(): Observable<any> {
    return this.httpClient.get(this.currentUserUrl).pipe(
      map(response => response)
    );
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
   * 分页
   * @param params name:名称,page:第几页,size:每页大小
   */
  page(params: { username?: string, klass_id?: number, role?: number, state?: number, page?: number, size?: number }):
    Observable<{ totalPages: number, content: Array<User> }> {
    const url = 'http://localhost:8080/User';

    /* 设置默认值 */
    if (params.page === undefined) {
      params.page = 0;
    }
    if (params.size === undefined) {
      params.size = 10;
    }
    /* 初始化查询参数 */
    const queryParams = new HttpParams()
      .set('username', params.username ? params.username : '')
      .set('klassId', params.klass_id ? params.klass_id : '')
      .set('role', params.role ? params.role : '')
      .set('state', params.state ? params.state : '')
      .set('page', params.page.toString())
      .set('size', params.size.toString());
    console.log(queryParams);

    return this.httpClient.get<{ totalPages: number, content: Array<User> }>(url, {params: queryParams});
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

  getUsersByKlassId(klassId: number): Observable<User[]> {
    const url = 'http://localhost:8080/User/getUsersByKlassId';
    const queryParams = new HttpParams()
      .set('klassId', klassId? klassId.toString() : '')
    return this.httpClient.get<User[]>(url, {params: queryParams});
  }

  /**
   * 获取某个学校
   * @param id 学校ID
   */
  getById(id: number | undefined): Observable<User> {
    const url = `http://localhost:8080/User/${id}`;
    return this.httpClient.get<User>(url);
  }

  /**
   * 删除学校
   * @param id 学校id
   */
  deleteById(id: number): Observable<void> {
    const url = `http://localhost:8080/User/${id}`;
    return this.httpClient.delete<void>(url);
  }
}
