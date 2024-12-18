import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators, ɵFormGroupValue, ɵTypedOrUntyped} from '@angular/forms';
import {School} from '../../norm/entity/School';
import {SchoolService} from '../../service/school.service';
import {SweetAlertService} from '../../service/sweet-alert.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'; // 更新导入路径
@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.sass']
})
export class AddComponent implements OnInit {
  school: ɵTypedOrUntyped<{ name: FormControl<string | null> }, ɵFormGroupValue<{
    name: FormControl<string | null>
  }>, any> = {
    name: ''
  } as School;

  formGroup = new FormGroup({
    name: new FormControl('', Validators.required)
  });

  constructor(private schoolService: SchoolService,
              private sweetAlertService: SweetAlertService,
              public dialogRef: MatDialogRef<AddComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
  }

  onSubmit(): void {
    this.school = this.formGroup.value;
    console.log(this.formGroup.value);
    this.schoolService.save(this.school).subscribe((school: School) => {
      this.dialogRef.close();
      this.sweetAlertService.showSuccess('新增成功', "success");
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
