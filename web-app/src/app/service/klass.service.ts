import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Klass} from '../norm/entity/Klass';

@Injectable({
  providedIn: 'root'
})
export class KlassService {
  private url = 'http://localhost:8080/Klass';

  constructor(private httpClient: HttpClient) {
  }

  all(): Observable<Klass[]> {
    const url = 'http://localhost:8080/Klass/list';
    return this.httpClient.get<Klass[]>(url);
  }

  /**
   * 分页
   * @param params name:名称,page:第几页,size:每页大小
   */
  page(params: { size: number; schoolId: null; name: any; page: number }):
    Observable<{ totalPages: number; content: Array<Klass> }> {
    const url = 'http://localhost:8080/Klass';

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

    return this.httpClient.get<{ totalPages: number, content: Array<Klass> }>(url, {params: queryParams});
  }

  /**
   * 保存学校
   * 直接调用HttpClient post方法
   * @param school 学校
   * @return 此返回值是个可观察对象：
   * 1. 其它人可以通过 订阅 操作来获取该对象后续发送的值。
   * 2. 该对象如果发送值，那么该值的类型必然是Klass。
   */
  save(school: Klass): Observable<Klass> {
    const url = 'http://localhost:8080/Klass';
    return this.httpClient.post<Klass>(url, school);
  }


  /**
   * 获取某个学校
   * @param id 学校ID
   */
  getById(id: number | undefined): Observable<Klass> {
    const url = `http://localhost:8080/Klass/${id}`;
    return this.httpClient.get<Klass>(url);
  }

  /**
   * 更新学校
   * @param id id
   * @param klass 班级
   */
  update(id: number | undefined, klass: Klass): Observable<Klass> {
    const url = `http://localhost:8080/Klass/${id}`;
    return this.httpClient.put<Klass>(url, klass);
  }

  /**
   * 删除学校
   * @param id 学校id
   */
  deleteById(id: number | undefined): Observable<void> {
    const url = `http://localhost:8080/Klass/${id}`;
    return this.httpClient.delete<void>(url);
  }


  getKlassBySchoolId(schoolId: number): Observable<Array<Klass>> {
    return this.httpClient.get<Array<Klass>>(`http://localhost:8080/Klass/getKlassBySchoolId/${schoolId}`);
  }

  /**
   * 通过学校id获取所属所有班级
   * @param schoolId
   * */
  getClazzBySchoolId(schoolId: number): Observable<Klass[]> {
    return this.httpClient.get<Klass[]>(this.url + '/' +  String(schoolId));
  }
}
