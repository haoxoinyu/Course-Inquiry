import { Component, Inject, OnInit } from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { School } from '../../norm/entity/School';
import { SweetAlertService } from '../../service/sweet-alert.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Term} from '../../norm/entity/Term';
import {TermService} from '../../service/term.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.sass']
})
export class EditComponent implements OnInit {
  formGroup: FormGroup | undefined;
  school: School | undefined;
  term: Term;

  constructor(
    private termService: TermService,
    private sweetAlertService: SweetAlertService,
    public dialogRef: MatDialogRef<EditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number }
  ) {
    this.term = {
      id: data.id,
      name: '',
      school: new School(0, ''),
      startTime: new Date(),
      endTime: new Date()
    };
  }

  canEdit: boolean = true;

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

  ngOnInit() {
    this.loadTermData();
    this.termService.getCoursesByTerm(this.term.id).subscribe((data )=>
    {
      console.log(data);
      this.canEdit = data;
    });
    console.log(this.canEdit);
    this.formGroup = new FormGroup({
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
  }

  /**
   * Load the class data to edit
   */
  loadTermData(): void {
    this.termService.getById(this.term.id).subscribe({
      next: (data) => {
        this.term = data;
        this.setFormGroupValue(this.term);
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
    this.term = {
      id: this.term.id,
      name: this.formGroup?.get('name')?.value,
      school: this.formGroup?.get('school')?.value,
      startTime: this.formGroup?.get('startTime')?.value,
      endTime: this.formGroup?.get('endTime')?.value
    };
    console.log(this.term);
    this.termService.update(this.term.id, this.term).subscribe({
      next: (result) => {
        if (result.message === "该学期已存在") {
          this.sweetAlertService.showError('编辑失败', '该学期已存在', 'error');
        } else if (result.message === "已存在相似时间的学期") {
          this.sweetAlertService.showError('编辑失败', '已存在相似时间的学期', 'error');
        } else{
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
    this.term.school = school;
    this.formGroup?.get('school')?.setValue(school);
  }

  /**
   * Set form group values
   * @param term Class object
   */
  setFormGroupValue(term: Term): void {
    if (term.school) {
      this.formGroup?.setValue({
        name: term.name,
        school: {
          id: term.school.id,
          name: term.school.name
        },
        startTime: term.startTime,
        endTime: term.endTime,
      });
    }
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
