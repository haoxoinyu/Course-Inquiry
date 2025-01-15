import { Component, Inject, OnInit } from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
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

  ngOnInit() {
    this.loadTermData();

    this.formGroup = new FormGroup({
      name: new FormControl('', Validators.required),
      school: new FormGroup({
        id: new FormControl('', Validators.required),
        name: new FormControl('', Validators.required),
      }),
      startTime: new FormControl(new Date(), Validators.required),
      endTime: new FormControl(new Date(), Validators.required)
    });
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
      id: this.formGroup?.get('school')?.get('id')?.value,
      name: this.formGroup?.get('name')?.value,
      school: this.formGroup?.get('school')?.value,
      startTime: this.formGroup?.get('startTime')?.value,
      endTime: this.formGroup?.get('endTime')?.value
    };
    console.log(this.term);
    this.termService.update(this.term.id, this.term).subscribe({
      next: (result) => {
        this.term = result;
        this.dialogRef.close();
        this.sweetAlertService.showSuccess('Edit successful', "success");
      },
      error: (error) => {
        console.error('Error updating class:', error);
        this.sweetAlertService.showError('Edit failed', '', error);
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
}
