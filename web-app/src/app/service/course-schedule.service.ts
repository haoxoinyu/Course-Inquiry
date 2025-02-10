import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Page} from "@yunzhi/ng-common";
import {Course} from "../norm/entity/Course";

@Injectable({
  providedIn: 'root'
})
export class CourseScheduleService {
  private url = 'http://localhost:8080/Course';

  constructor(private httpClient: HttpClient) { }

  /**
   * 分页
   * @param params name课程名称  klassId 班级 teacherId 教师
   */
  getCourseTable(params: {
    schoolId?: number,
    klassId?: number,
    termId?:  number,
    userId?: number,
    week?: number,
  }): Observable<any> {

    /* 初始化查询参数 */
    const queryParams = new HttpParams()
      .set('schoolId', params.schoolId ? params.schoolId.toString() : '')
      .set('klassId', params.klassId ? params.klassId.toString() : '')
      .set('termId', params.termId ? params.termId.toString() : '')
      .set('userId', params.userId ? params.userId.toString() : '')
      .set('week', params.week ? params.week : '')
    console.log(queryParams);
    return this.httpClient.get<any>(this.url + '/course-schedule', {params: queryParams});
  }
}
