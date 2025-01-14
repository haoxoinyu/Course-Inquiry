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
}
