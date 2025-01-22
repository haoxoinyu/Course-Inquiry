import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {School} from "../../norm/entity/School";
import {Klass} from "../../norm/entity/Klass";
import {KlassService} from "../../service/klass.service";
import {SweetAlertService} from "../../service/sweet-alert.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {User} from "../../norm/entity/User";
import {UserService} from "../../service/user.service";

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.sass']
})
export class EditComponent implements OnInit {

  formGroup: FormGroup | undefined;
  school: School | undefined;
  user: User | undefined;
  newUser: User | undefined;
  me: User | undefined;
  klasses: Klass[] | undefined;
  private url: string | undefined;

  constructor(
    private klassService: KlassService,
    private userService: UserService,
    private sweetAlertService: SweetAlertService,
    public dialogRef: MatDialogRef<EditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User
  ) {
    this.user = {
      id: data.id,
      username: data.username,
      name: data.name,
      role: data.role,
      state: data.state,
      sex: data.sex,
      klass: data.klass,
      password: data.password,
    };
  }

  ngOnInit() {
    this.loadData();
    this.userService.me().subscribe((user) => {
      this.me = user;
      console.log(user);
    });
    this.klassService.all().subscribe((klass) => {
      console.log(klass);
      this.klasses = klass;
    });
    this.formGroup = new FormGroup({
      username: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      school: new FormGroup({
        id: new FormControl('', Validators.required),
        name: new FormControl('', Validators.required),
      }),
      klass_id: new FormControl('', Validators.required),
      sex: new FormControl(false, Validators.required),
      role: new FormControl(3, Validators.required),
      state: new FormControl('', Validators.required),
    });
  }

  /**
   * Load the class data to edit
   */
  loadData(): void {
    this.userService.getById(this.user?.id).subscribe({
      next: (data) => {
        this.user = data;
        this.setFormGroupValue(this.user);
      },
      error: (error) => {
        console.error('Error loading class data:', error);
        this.sweetAlertService.showError('Failed to load data', '', "error");
      }
    });
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    this.newUser = {
      id: this.user!.id,
      username: this.formGroup?.get('username')?.value,
      name: this.formGroup?.get('name')?.value,
      klass: new Klass(Number(this.formGroup?.get('klass_id')?.value!)),
      role: this.formGroup?.get('role')?.value,
      state: this.formGroup?.get('state')?.value,
      sex: this.formGroup?.get('sex')?.value,
      password: this.user?.password,
    };
    this.userService.update(this.newUser!.id, this.newUser).subscribe({
      next: (result) => {
        if(result.message === "该用户已存在") {
          this.sweetAlertService.showError('编辑失败', '该用户已存在', 'error')
        } else {
          this.dialogRef.close();
          this.sweetAlertService.showSuccess('编辑成功', "success");
        }
      },
      error: (error) => {
        console.error('Error updating class:', error);
        this.sweetAlertService.showError('编辑失败', '', error);
      }
    });
  }

  /**
   * Handle school selection
   * @param school School object
   */
  onSelected(school: School): void {
    this.user!.klass!.school = school;
    this.formGroup?.get('school')?.setValue(school);
    this.getKlassBySchoolId(school.id);
  }

  getKlassBySchoolId(schoolId: number) {
    this.klassService.getKlassBySchoolId(schoolId)
      .subscribe((klasses: Klass[] | undefined) => {
        this.klasses = klasses;
      }, (error: any) => {
        console.error('获取班级失败', error);
      });
  }

  /**
   * Set form group values
   * @param klass Class object
   */
  setFormGroupValue(user: User): void {
    this.formGroup?.setValue({
      username: user.username,
      name: user.name,
      school: {
        id: user.klass?.school?.id,
        name: user.klass?.school?.name
      },
      klass_id: user.klass?.id,
      sex: user.sex,
      role: user.role,
      state: user.state,
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
