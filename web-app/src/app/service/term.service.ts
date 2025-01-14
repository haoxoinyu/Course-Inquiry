import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Term} from "../norm/entity/Term";

@Injectable({
  providedIn: 'root'
})
export class TermService {
  private url = 'http://localhost:8080/Term';

  constructor(private httpClient: HttpClient) {
  }

  /**
   * 分页
   * @param params name:名称,page:第几页,size:每页大小
   */
  page(params: { size: number; schoolId: null; name: any; page: number }):
    Observable<{ totalPages: number; content: Array<Term> }> {
    const url = 'http://localhost:8080/Term';

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
      .set('schoolId', params.schoolId ? params.schoolId : '')
      .set('page', params.page.toString())
      .set('size', params.size.toString());
    console.log(queryParams);

    return this.httpClient.get<{ totalPages: number, content: Array<Term> }>(url, {params: queryParams});
  }

  /**
   * 保存学校
   * 直接调用HttpClient post方法
   * @param school 学校
   * @return 此返回值是个可观察对象：
   * 1. 其它人可以通过 订阅 操作来获取该对象后续发送的值。
   * 2. 该对象如果发送值，那么该值的类型必然是Klass。
   */
  save(school: Term): Observable<Term> {
    const url = 'http://localhost:8080/Term';
    return this.httpClient.post<Term>(url, school);
  }


  /**
   * 获取某个学期
   * @param id 学校ID
   */
  getById(id: number | undefined): Observable<Term> {
    const url = `http://localhost:8080/Term/${id}`;
    return this.httpClient.get<Term>(url);
  }

  /**
   * 更新学期
   * @param id id
   * @param term 学期
   */
  update(id: number | undefined, term: Term): Observable<Term> {
    const url = `http://localhost:8080/Term/${id}`;
    return this.httpClient.put<Term>(url, term);
  }

  /**
   * 删除学期
   * @param id 学期id
   */
  deleteById(id: number | undefined): Observable<void> {
    const url = `http://localhost:8080/Term/${id}`;
    return this.httpClient.delete<void>(url);
  }
}
