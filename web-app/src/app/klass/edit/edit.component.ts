import { Component, Inject, OnInit } from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Klass } from '../../norm/entity/Klass';
import { School } from '../../norm/entity/School';
import { SweetAlertService } from '../../service/sweet-alert.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { KlassService } from '../../service/klass.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.sass']
})
export class EditComponent implements OnInit {
  formGroup: FormGroup | undefined;
  school: School | undefined;
  klass: Klass;
  private url: string | undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private httpClient: HttpClient,
    private klassService: KlassService,
    private sweetAlertService: SweetAlertService,
    public dialogRef: MatDialogRef<EditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number }
  ) {
    this.klass = {
      id: data.id,
      name: '',
      school: new School(0, '')
    };
  }

  ngOnInit() {
    this.loadKlassData();

    this.formGroup = new FormGroup({
      name: new FormControl('', Validators.required),
      school: new FormGroup({
        id: new FormControl('', Validators.required),
        name: new FormControl('', Validators.required),
      }),
    });
  }

  /**
   * Load the class data to edit
   */
  loadKlassData(): void {
    this.klassService.getById(this.klass.id).subscribe({
      next: (data) => {
        this.klass = data;
        this.setFormGroupValue(this.klass);
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
    this.klass = {
      id: this.formGroup?.get('school')?.get('id')?.value,
      name: this.formGroup?.get('name')?.value,
      school: this.formGroup?.get('school')?.value
    };
    this.klassService.update(this.klass.id, this.klass).subscribe({
      next: (result) => {
        this.klass = result;
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
    this.klass.school = school;
    this.formGroup?.get('school')?.setValue(school);
  }

  /**
   * Set form group values
   * @param klass Class object
   */
  setFormGroupValue(klass: Klass): void {
    this.formGroup?.setValue({
      name: klass.name,
      school: {
        id: klass.school?.id,
        name: klass.school?.name
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
