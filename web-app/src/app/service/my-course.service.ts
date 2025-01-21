import {Injectable} from '@angular/core';
import {Course} from '../norm/entity/Course';
import {Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Page} from '../norm/entity/page';
import { User } from '../norm/entity/User';
import {CourseUser} from "../norm/entity/CourseUser";

@Injectable({
  providedIn: 'root'
})
export class MyCourseService {
  private url = 'http://localhost:8080/MyCourse';

  constructor(private httpClient: HttpClient) {
  }

  /**
   * 保存课程
   * @param courseUser
   */
  save(courseUser: CourseUser | undefined): Observable<CourseUser> {
    console.log('save', courseUser);
    return this.httpClient.post<CourseUser>(this.url, courseUser);
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
   * @param params
   */
  page(params: {
    term_id?:  number,
    userId?: number,
    name?: string,
    sory?: number,
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
      .set('courseName', params.name ? params.name : '')
      .set('termId', params.term_id ? params.term_id.toString() : '')
      .set('userId', params.userId ? params.userId.toString() : '')
      .set('sory', params.sory ? params.sory.toString() : '')
      .set('page', params.page.toString())
      .set('size', params.size.toString());
    return this.httpClient.get<Page<Course>>(this.url, {params: queryParams});
  }

  getCoursesByTermId(params: {
    termId?: number;
    sory?: number;
  }): Observable<Course[]> {
    const queryParams = new HttpParams()
      .set('termId', params.termId?.toString() || '')
      .set('sory', params.sory?.toString() || '');

    return this.httpClient.get<Course[]>(`${this.url}/getCoursesByTermId`, { params: queryParams });
  }

  /**
   * 增加新课程
   *
   *
   ***/
  add(courseUser:  {
    courseId?:  number | null,
    userId?: number | null
  }): Observable<void> {

    let newCourseUser = {
      courseId: courseUser.courseId,
      userId: courseUser.userId
    }
    return this.httpClient.post<void>(this.url + '/add', newCourseUser);
  }

  /**
   * 删除
   * @param
   */
  delete(courseId: number, userId: number): Observable<void> {
    const url = `http://localhost:8080/MyCourse?courseId=${courseId}&userId=${userId}`;
    return this.httpClient.delete<void>(url);
  }
}
