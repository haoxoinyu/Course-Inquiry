import {ApiInjector, MockApiInterface} from '@yunzhi/ng-mock-api';
import { HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

// 模拟的随机数生成函数
function randomNumber(): number {
  return Math.floor(Math.random() * 10000);
}

// 模拟的随机字符串生成函数
function randomString(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).substring(2, 8)}`;
}

// 用户实体类型
interface User {
  id: number;
  name: string;
  username: string;
  password?: string;
  sex?: boolean;
  role?: number;
  state?: number;
  klass?: any;
}

export class LoginApi implements  MockApiInterface{
  private currentLoginUser: User | null = null;

  // 设置当前登录用户
  private setCurrentLoginUser(user: User): void {
    this.currentLoginUser = user;
  }

  // 获取当前登录用户
  private getCurrentLoginUser(): User | null {
    return this.currentLoginUser;
  }

  getInjectors(): ApiInjector[] {
    return [
      {
        url: '/user/login',
        method: 'POST',
        description: '用户登录',
        result: (urlMatches: any, options: { headers: HttpHeaders, body: any }) => {
          const { username, password } = options.body;

          // 模拟登录逻辑
          if (username !== null && password === 'yunzhi') {
            const user: User = {
              id: randomNumber(),
              username,
              password,
              name: randomString('姓名'),
              role: 1, // 模拟的角色，例如 1 表示管理员
              state: 1, // 模拟状态，例如 1 表示正常
            };

            // 设置当前登录用户
            this.setCurrentLoginUser(user);

            return {
              id: user.id,
              username: user.username,
              name: user.name,
              token: 'mock-token-' + randomString('token'),
              message: '登录成功'
            };
          } else {
            return new Observable<HttpErrorResponse>(subscriber => {
              subscriber.error(new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' }));
              subscriber.complete();
            });
          }
        }
      },
      {
        url: '/user/currentLoginUser',
        method: 'GET',
        description: '获取当前登录用户',
        result: () => {
          const user = this.getCurrentLoginUser();

          if (user) {
            return {
              id: user.id,
              name: user.name,
              username: user.username,
              role: user.role,
              state: user.state,
            };
          } else {
            return new Observable<HttpErrorResponse>(subscriber => {
              subscriber.error(new HttpErrorResponse({ status: 401, statusText: 'No user logged in' }));
              subscriber.complete();
            });
          }
        }
      }
    ];
  }
}
