import {Component, Inject, OnInit} from '@angular/core';
import {School} from "../../norm/entity/School";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {SweetAlertService} from "../../service/sweet-alert.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Klass} from "../../norm/entity/Klass";
import {UserService} from "../../service/user.service";
import {KlassService} from "../../service/klass.service";
import {User} from "../../norm/entity/User";
import {SchoolService} from "../../service/school.service";

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

  me?: User;
  klass: Klass | undefined;
  klasses: Klass[] | undefined;
  schools: School[] | undefined;

  formGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    school: new FormGroup({
      id: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
    }),
    klass_id: new FormControl('', Validators.required),
    sex: new FormControl(false, Validators.required),
    role: new FormControl(3, Validators.required),
  });

  constructor(private httpClient: HttpClient,
              private userService: UserService,
              private klassService: KlassService,
              private schoolService: SchoolService,
              private sweetAlertService: SweetAlertService,
              public dialogRef: MatDialogRef<AddComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.userService.me().subscribe((user) => {
      this.me = user;
      console.log(user);
    });
    this.schoolService.all().subscribe((school) => {
      console.log(school);
      this.schools = school;
    });
    this.klassService.all().subscribe((klass) => {
      console.log(klass);
      this.klasses = klass;
    });
  }

  onSubmit(): void {
    console.log('on submit');
    const url = 'http://localhost:8080/User';
    const user = new User(
      0,
      this.formGroup.get('username')?.value!,
      this.formGroup.get('name')?.value!,
      this.formGroup.get('role')?.value!,
      'yunzhi',
      Boolean(this.formGroup.get('sex')?.value!),
      1,
      new Klass(Number(this.formGroup.get('klass_id')?.value!)),
  );
    console.log(user);// 确保这里使用的是正确的表单值
    this.httpClient.post(url, user)
      .subscribe((data: any) => {
        if (data.message === "该用户已存在") {
          this.sweetAlertService.showError('新增失败', '该用户已存在', 'error');
        } else{
          this.dialogRef.close();
          this.sweetAlertService.showSuccess('新增成功', "success");
        }
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
    this.getKlassBySchoolId(school.id);
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

  getKlassBySchoolId(schoolId: number) {
    this.klassService.getKlassBySchoolId(schoolId)
      .subscribe((klasses: Klass[] | undefined) => {
        this.klasses = klasses;
      }, (error: any) => {
        console.error('获取班级失败', error);
      });
  }
}
