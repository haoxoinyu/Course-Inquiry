import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DingdingService {

  private url = 'http://localhost:8080/DingdingsendCurrentSchedule';
  constructor(private httpClient: HttpClient) { }

  /**
   * 增加钉钉机器人webhookUrl
   ***/
  addDingdingRobot(webhookUrl: string): Observable<void> {
    return this.httpClient.post<void>(this.url + '/add', webhookUrl);
  }
}
