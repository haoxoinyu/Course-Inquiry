import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CourseScheduleService {
  private url = 'http://localhost:8080/Course';

  constructor(private httpClient: HttpClient) { }

  getCourseTable(schoolId: number, clazzId: number, termId: number, week: null): Observable<any> {
    const searchParameters = {
      schoolId: schoolId,
      clazzId: clazzId,
      termId: termId,
      week: week
    };
    console.log(searchParameters);
    return this.httpClient.post(this.url + '/course-schedule', searchParameters);
  }
}
