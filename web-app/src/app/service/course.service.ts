import {Injectable} from '@angular/core';
import {Course} from '../norm/entity/Course';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
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
  page(params?: {name?: string, klassId?: number, teacherId?: number}): Observable<Page<Course>> | null {
    return null;
  }
}
