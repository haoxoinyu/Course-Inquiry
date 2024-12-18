import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {School} from '../../norm/entity/School';
import {SchoolService} from '../../service/school.service';
import {SweetAlertService} from '../../service/sweet-alert.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.sass']
})
export class AddComponent implements OnInit {
  school = {
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
      this.sweetAlertService.showSuccess('新增成功', '');
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}