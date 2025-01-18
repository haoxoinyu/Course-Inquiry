import {Injectable} from '@angular/core';
import {Course} from '../norm/entity/Course';
import {Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Page} from '../norm/entity/page';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private url = 'http://localhost:8080/Course';

  constructor(private httpClient: HttpClient) {
  }

  /**
   * 保存课程
   * @param course 课程
   */
  save(course: Course | undefined): Observable<Course> {
    return this.httpClient.post<Course>(this.url, course);
  }

  /**
   * 课程名称是否存在
   * @param name 课程名称
   */
  existsByName(name: string): Observable<boolean> {
    const url = this.url + '/existsByName';
    return this.httpClient.get<boolean>(url, {params: {name}});
  }

  /**
   * 分页
   * @param params name课程名称  klassId 班级 teacherId 教师
   */
  page(params: {
    schoolId?: number,
    klassId?: number,
    termId?:  number,
    userId?: number,
    name?: string,
    page: number,
    size: number
  }): Observable<Page<Course>> {
     /* 设置默认值*/
     if (params.page === undefined) {
      params.page = 0;
    }
    if (params.size === undefined) {
      params.size = 10;
    }

    /* 初始化查询参数 */
    const queryParams = new HttpParams()
      .set('name', params.name ? params.name : '')
      .set('schoolId', params.schoolId ? params.schoolId.toString() : '')
      .set('klassId', params.klassId ? params.klassId.toString() : '')
      .set('termId', params.termId ? params.termId.toString() : '')
      .set('userId', params.userId ? params.userId.toString() : '')
      .set('page', params.page.toString())
      .set('size', params.size.toString());
    return this.httpClient.get<Page<Course>>(this.url, {params: queryParams});
  }
}
