import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { School } from '../../norm/entity/School';
import { SchoolService } from '../../service/school.service';
import { ActivatedRoute } from '@angular/router';
import { SweetAlertService } from '../../service/sweet-alert.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.sass']
})
export class EditComponent implements OnInit {
  formGroup: FormGroup | undefined;
  school!: School;

  constructor(
    private activatedRoute: ActivatedRoute,
    private schoolService: SchoolService,
    private sweetAlertService: SweetAlertService,
    public dialogRef: MatDialogRef<EditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number }
  ) {}

  ngOnInit() {
    this.loadSchoolById(this.data.id);

    this.formGroup = new FormGroup({
      name: new FormControl('', Validators.required)
    });
  }

  onSubmit() {
    this.school.name = this.formGroup?.get('name')!.value;
    this.update(this.school);
  }

  /**
   * 更新学校信息
   * @param school 学校对象
   */
  update(school: School) {
    this.schoolService.update(school.id, school).subscribe(
      (result) => {
        this.school = result;
        this.dialogRef.close();
        this.sweetAlertService.showSuccess('编辑成功', "success");
      },
      (error) => {
        console.error('Error updating school:', error);
        this.sweetAlertService.showError('编辑失败', '', "error");
      }
    );
  }

  /**
   * 根据 ID 加载学校信息
   * @param id 学校 ID
   */
  loadSchoolById(id: number) {
    this.schoolService.getById(id).subscribe(
      (school) => {
        this.school = school;
        this.setFormGroupValue(this.school);
      },
      (error) => {
        console.error('Error loading school:', error);
        this.sweetAlertService.showError('加载失败', '', "error");
      }
    );
  }

  /**
   * 设置表单值
   * @param school 学校对象
   */
  setFormGroupValue(school: School) {
    this.formGroup?.setValue({
      name: school.name
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
