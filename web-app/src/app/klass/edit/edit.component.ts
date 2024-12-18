import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {Klass} from '../../norm/entity/Klass';
import {School} from '../../norm/entity/School';
import {SweetAlertService} from '../../service/sweet-alert.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {KlassService} from '../../service/klass.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.sass']
})
export class EditComponent implements OnInit {
  formGroup: FormGroup;
  school: School;
  private url: string;
  klass = {
    id: 0,
    name: '',
    school: new School(0, '')
  } as Klass;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private httpClient: HttpClient,
              private klassService: KlassService,
              private sweetAlertService: SweetAlertService,
              public dialogRef: MatDialogRef<EditComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((param: { id: number }) => {
      param.id = this.data.id;
      this.klass.id = param.id;
      this.loadData();
    });

    this.formGroup = new FormGroup({
      name: new FormControl('', Validators.required),
      school: new FormGroup({
        id: new FormControl('', Validators.required),
        name: new FormControl('', Validators.required),
      }),
    });
  }

  /**
   * 加载要编辑的班级数据
   */
  loadData(): void {
    this.klassService.getById(this.klass.id)
      .subscribe(data => {
        this.klass = data;
        this.setFormGroupValue(this.klass);
        console.log(this.klass.school);
        console.log(this.formGroup.get('school').value);
      });
  }

  /**
   * 用户提交时执行的操作
   */
  onSubmit(): void {
    this.klass = {
      id: this.klass.id,
      name: this.formGroup.value.name,
      school: this.formGroup.value.school,
    };
    this.klassService.update(this.klass.id, this.klass)
      .subscribe((result) => {
        this.school = result;
        this.dialogRef.close();
        this.sweetAlertService.showSuccess('编辑成功', '');
      });
  }

  /**
   * 选中某个教师时
   * @param school 学校
   */
  onSelected(school: School): void {
    this.klass.school = school;
    this.formGroup.get('school').setValue(school);
  }

  /**
   * 设置表单值
   * @param school 学校
   */
  setFormGroupValue(klass: Klass) {
    this.formGroup.setValue({
      name: klass.name,
      school: klass.school
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

