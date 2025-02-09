import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private url = 'http://localhost:8080/Schedule';
  constructor(private httpClient: HttpClient) { }

    //获取当前日期所在星期的星期一日期的字符串
    getFirstDayOfCurrentWeek(date: string): Observable<number> {
      const queryParams = new HttpParams()
      .set('date', date ? date : '')
      return this.httpClient.get<number>(this.url + '/getfirstDayOfCurrentWeek', {params: queryParams})
    }

    getUnbusyStudentsOfCurrentWeek(date: string): Observable<any> {
      const queryParams = new HttpParams()
      .set('date', date ? date : '')
      return this.httpClient.get<any>(this.url + '/getUnbusyStudentsOfCurrentWeek', {params: queryParams})
    }
}
