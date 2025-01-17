import { Component, Inject, OnInit } from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { School } from '../../norm/entity/School';
import { SweetAlertService } from '../../service/sweet-alert.service';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Term} from "../../norm/entity/Term";
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

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

  // 开始时间过滤器：只允许选择周一
  isMondayValidator: ValidatorFn = (control: AbstractControl) => {
    const value = control.value;
    if (!value) {
      return null;
    }
    const date = new Date(value);
    return date.getDay() === 1 ? null : { 'isNotMonday': true };
  }

  // 结束时间过滤器：只允许选择周日
  isSundayValidator: ValidatorFn = (control: AbstractControl) => {
    const value = control.value;
    if (!value) {
      return null;
    }
    const date = new Date(value);
    return date.getDay() === 0 ? null : { 'isNotSunday': true };
  }

  formGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(40)
    ]),
    school: new FormGroup({
      id: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
    }),
    startTime: new FormControl('', [Validators.required, this.isMondayValidator]),
    endTime: new FormControl('', [Validators.required, this.isSundayValidator]),
  }, { validators: this.validateDateRange() });

  constructor(private httpClient: HttpClient,
              private sweetAlertService: SweetAlertService,
              public dialogRef: MatDialogRef<AddComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
  }

  onSubmit(): void {
    console.log('on submit');
    const url = 'http://localhost:8080/Term';
    const term = new Term(undefined, this.formGroup.get('name')?.value!,
      this.school, new Date(), new Date()); // 确保这里使用的是正确的表单值
    this.httpClient.post(url, term)
      .subscribe(() => {
        console.log('保存成功');
        console.log(term);
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

  // 自定义验证器：确保日期范围在18到22周之间
  validateDateRange(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const startTime = control.get('startTime')?.value;
      const endTime = control.get('endTime')?.value;

      if (startTime && endTime) {
        const start = new Date(startTime);
        const end = new Date(endTime);
        const weeks = (end.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000);

        if (weeks < 18 || weeks > 22) {
          return { invalidDateRange: true };
        }
      }

      return null;
    };
  }
}
