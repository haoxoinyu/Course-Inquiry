import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.sass']
})
export class IndexComponent implements OnInit {
// 定义用户数组
  users = new Array();

  constructor(private httpClient: HttpClient) {
  }

  /**
   * 该方法将在组件准备完毕后被调用
   */
  ngOnInit() {
    /* 后台数据的请求地址，如果变量定义后不再重新赋值，则应该使用const来定义 */
    const url = 'http://localhost:8080/User/';

    /* 使用get方法请求url，请求一旦成功后，将调用传入的第一个方法；如果请求失败，将调用传入的第二个方法 */
    this.httpClient.get(url)
      .subscribe((response: any) => {
        console.log(response);
        this.users = response;
      }, (response) => {
        console.log(response);
        console.error('请求出错');
      });
  }

  /**
   * 点击删除按钮时删除对应的用户
   * @param user 要删除的用户
   */
  onDelete(user: { id: string }): void {
    const url = 'http://localhost:8080/User/' + user.id;
    this.httpClient.delete(url)
      .subscribe(() => {
        console.log('删除成功');
        this.ngOnInit();
      }, () => {
        console.log('删除失败');
      });
  }

}
