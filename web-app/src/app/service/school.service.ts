import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {School} from '../norm/entity/School';
import {FormControl, ɵFormGroupValue, ɵTypedOrUntyped} from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class SchoolService {

  constructor(private httpClient: HttpClient) {
  }

  all(): Observable<School[]> {
    const url = 'http://localhost:8080/School/list';
    return this.httpClient.get<School[]>(url);
  }

  /**
   * 分页
   * @param params name:名称,page:第几页,size:每页大小
   */
  page(params: { name?: string, page?: number, size?: number }):
    Observable<{ totalPages: number, content: Array<School> }> {
    const url = 'http://localhost:8080/School';

    /* 设置默认值 */
    if (params.page === undefined) {
      params.page = 0;
    }
    if (params.size === undefined) {
      params.size = 10;
    }

    /* 初始化查询参数 */
    const queryParams = new HttpParams()
      .set('name', params.name ? params.name : '')
      .set('page', params.page.toString())
      .set('size', params.size.toString());
    console.log(queryParams);

    return this.httpClient.get<{ totalPages: number, content: Array<School> }>(url, {params: queryParams});
  }

  /**
   * 保存学校
   * 直接调用HttpClient post方法
   * @param school 学校
   * @return 此返回值是个可观察对象：
   * 1. 其它人可以通过 订阅 操作来获取该对象后续发送的值。
   * 2. 该对象如果发送值，那么该值的类型必然是School。
   */
  save(school: ɵTypedOrUntyped<{ name: FormControl<string | null> }, ɵFormGroupValue<{ name: FormControl<string | null> }>, any>): Observable<any> {
    const url = 'http://localhost:8080/School';
    return this.httpClient.post<School>(url, school);
  }


  /**
   * 获取某个学校
   * @param id 学校ID
   */
  getById(id: number): Observable<School> {
    const url = `http://localhost:8080/School/${id}`;
    return this.httpClient.get<School>(url);
  }

  /**
   * 更新学校
   * @param id id
   * @param school 学校
   */
  update(id: number, school: School): Observable<any> {
    const url = `http://localhost:8080/School/${id}`;
    return this.httpClient.put<School>(url, school);
  }

  /**
   * 删除学校
   * @param id 学校id
   */
  deleteById(id: number): Observable<any> {
    const url = `http://localhost:8080/School/${id}`;
    return this.httpClient.delete<void>(url);
  }
}
