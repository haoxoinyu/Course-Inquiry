import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DingdingService } from 'src/app/service/dingding.service';
import { SweetAlertService } from 'src/app/service/sweet-alert.service';

@Component({
  selector: 'app-add-dingding-robots',
  templateUrl: './add-dingding-robots.component.html',
  styleUrls: ['./add-dingding-robots.component.sass']
})
export class AddDingdingRobotsComponent implements OnInit {


  formGroup = new FormGroup({
    webhookUrl: new FormControl('', Validators.required),
  })
  

  constructor(
    public dialogRef: MatDialogRef<AddDingdingRobotsComponent>,
    private dingdingService: DingdingService,
    private sweetAlertService:SweetAlertService
  ) {}

  ngOnInit(): void {
    
  }
  
  onSubmit() {
    this.dingdingService.addDingdingRobot(this.formGroup.get('webhookUrl')?.value!)
      .subscribe(() => {
        this.sweetAlertService.showSuccess('新增成功！', 'success');
        this.onNoClick();
      },error => {
        console.log('错误信息', error.error);
        this.sweetAlertService.showError('添加失败', error.error , 'error');
      })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
