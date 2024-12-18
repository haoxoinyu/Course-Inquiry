import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {School} from '../../norm/entity/School';
import {SchoolService} from '../../service/school.service';
import {ActivatedRoute} from '@angular/router';
import {SweetAlertService} from '../../service/sweet-alert.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.sass']
})
export class EditComponent implements OnInit {

  formGroup: FormGroup;
  school = {
    name: ''
  } as School;

  constructor(private activatedRoute: ActivatedRoute,
              private schoolService: SchoolService,
              private sweetAlertService: SweetAlertService,
              public dialogRef: MatDialogRef<EditComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((param: { id: number }) => {
      param.id = this.data.id;
      this.school.id = param.id;
      this.loadSchoolById(this.school.id);
    });

    this.formGroup = new FormGroup({
      name: new FormControl('', Validators.required)
    });
  }

  onSubmit() {
    this.school.name = this.formGroup.get('name').value;
    this.update(this.school);
  }

  /**
   * 更新学生
   * @param school 学生
   */
  update(school: School) {
    this.schoolService.update(school.id, school)
      .subscribe((result) => {
        this.school = result;
        this.dialogRef.close();
        this.sweetAlertService.showSuccess('编辑成功', '');
      });
  }

  /**
   * 加载学生
   * @param id 学生ID
   */
  loadSchoolById(id: number) {
    this.schoolService.getById(id)
      .subscribe(school => {
        this.school = school;
        this.setFormGroupValue(this.school);
      });
  }

  /**
   * 设置表单值
   * @param school 学校
   */
  setFormGroupValue(school: School) {
    this.formGroup.setValue({
      name: school.name
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
