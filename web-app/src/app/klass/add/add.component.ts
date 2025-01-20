import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { School } from '../../norm/entity/School';
import { Klass } from '../../norm/entity/Klass';
import { SweetAlertService } from '../../service/sweet-alert.service';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.sass']
})
export class AddComponent implements OnInit {
  /*当发生请求错误时，显示该信息*/
  public static errorMessage = '数据保存失败，这可能是由于网络的原因引起的';
  school: School | undefined;
  /*当该值不为空时，可以显示在前台并提示用户*/
  message: string | undefined;

  formGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    school: new FormGroup({
      id: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
    }),
  });

  constructor(private httpClient: HttpClient,
              private sweetAlertService: SweetAlertService,
              public dialogRef: MatDialogRef<AddComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
  }

  onSubmit(): void {
   
    const url = 'http://localhost:8080/Klass';
    const klass = new Klass(undefined, this.formGroup.get('name')?.value!,
      this.school); // 确保这里使用的是正确的表单值
      console.log('on submit', klass);
    this.httpClient.post(url, klass)
      .subscribe(() => {
        console.log('保存成功');
        this.sweetAlertService.showSuccess('新增成功', "success");
      }, (response) => {
        console.log(`向${url}发起的post请求发生错误` + response);
        this.setMessage(AddComponent.errorMessage);
      });
  }

  /**
   * 当选择某个学校时触发
   * @param school 学校
   */
  onSchoolSelected(school: School) {
    const schoolValue = {
      id: school.id.toString(),
      name: school.name
    };
    this.formGroup.get('school')?.setValue(schoolValue);
    this.school = school;
  }

  /**
   * 使用传的值来设置message，并在1.5秒后将消息置空
   * @param message 消息
   */
  private setMessage(message: string): void {
    this.message = message;
    setTimeout(() => {
      this.message = '';
    }, 1500);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
