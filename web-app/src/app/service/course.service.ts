import {Injectable} from '@angular/core';
import {Course} from '../norm/entity/Course';
import {Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Page} from '../norm/entity/page';
import { User } from '../norm/entity/User';
import {Term} from "../norm/entity/Term";

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

  /**
   * 增加新课程
   *
   *
   ***/
  add(course:  {
    name?: string | null,
    sory?: number | null,
    week?: (number | null)[],
    day?: number  | null,
    period?: number | null,
    schoolId?: number | null,
    clazz_id?: number | null,
    term_id?: number | null,
    userId?: number | null
  }): Observable<void> {

    let newCourse = {
      name: course.name,
      sory: course.sory,
      week: course.week,
      day: [course.day],
      period: [course.day],
      schoolId: course.schoolId,
      klassId: course.clazz_id,
      termId: course.term_id,
      userId: course.userId
    }
    return this.httpClient.post<void>(this.url + '/add', newCourse);
  }

  /**
   * 获取课程通过id
   * @param id 课程id
   * **/
  getById(courseId: number): Observable<Course> {
    /* 初始化查询参数 */
    const queryParams = new HttpParams()
    .set('courseId', courseId ? courseId.toString() : '')
    return this.httpClient.get<Course>(this.url + '/findById', {params: queryParams})
  }

  /**
   * 更新课程
   * @param course 更新的信息
   * **/
  update(course:  {
    id: number
    name?: string | null,
    sory?: number | null,
    week?: (number | null)[],
    day?: number  | null,
    period?: number | null,
    schoolId?: number | null,
    clazz_id?: number | null,
    term_id?: number | null,
    userId?: number | null
  }): Observable<void> {
    let updateCourse = {
      id: course.id,
      name: course.name,
      sory: course.sory,
      week: course.week,
      day: [course.day],
      period: [course.day],
      schoolId: course.schoolId,
      klassId: course.clazz_id,
      termId: course.term_id,
      userId: course.userId
    }
    return this.httpClient.put<void>(this.url + '/updateCourse', updateCourse)
  }

  /**
   * 删除对应课程
   * @param courseId 课程id
   */
  onDelete(courseId: number): Observable<void> {
    return this.httpClient.delete<void>(this.url + '/delete/' + courseId);
  }
}
