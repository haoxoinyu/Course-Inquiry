import {ApiInjector, MockApiInterface, RequestOptions} from '@yunzhi/ng-mock-api';
import {Term} from "../app/norm/entity/Term";
import {HttpParams} from "@angular/common/http";
import {Assert, randomNumber, randomString} from '@yunzhi/utils';
import {generatePage} from '@yunzhi/ng-common';
import {School} from "../app/norm/entity/School";


export class TermApi implements MockApiInterface {
  private names = [
    '张三三', '李四四', '张三亚', '李四', '瓦瓦和', '王五'
  ];
  getInjectors(): ApiInjector[] {
    return [
      {
        method: 'GET',
        url: '/term/getAll',
        result: (urlMatcher: any, options: RequestOptions) => {
          const params = options.params as HttpParams;
          const pageStr = params.get('page');
          const sizeStr = params.get('size');
          const page: number = pageStr ? Number(pageStr) : 1; // 默认为1
          const size: number = sizeStr ? Number(sizeStr) : 10; // 默认为10
          const name = params.get('name') ? params.get('name') : '';

          Assert.isInteger(page, 'page类型不正确');
          Assert.isInteger(size, 'size类型不正确');

          return generatePage<Term>(page, size, index => {
            return {
              id: 1,
              name: name ? randomString(name, 2) : randomString(this.names[Math.floor(Math.random() * this.names.length)]),
              school:
                {
                  name: '消炎药'
                } as School,
              startTime: new Date(),
              endTime: new Date(),
            } as Term;
          });
        }
      }
    ]
  }
}

