import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor(private httpClient: HttpClient) { }

    //获取当前日期所在星期的星期一日期的字符串
    getFirstDayOfCurrentWeek(date: string): Observable<number> {
      const queryParams = new HttpParams()
      .set('date', date ? date : '')
      return this.httpClient.get<number>('/Schedule/getfirstDayOfCurrentWeek', {params: queryParams})
    }
  
    getUnbusyStudentsOfCurrentWeek(date: number): Observable<any> {
      const queryParams = new HttpParams()
      .set('date', date ? date : '')
      return this.httpClient.get<any>('/Schedule/getUnbusyStudentsOfCurrentWeek', {params: queryParams})
    }
}
