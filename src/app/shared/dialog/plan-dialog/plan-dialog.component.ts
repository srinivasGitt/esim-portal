import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogComponent } from '../../service/dialog';
import { PlansService } from '../../service/plans.service';
import { RegionsService } from '../../service/regions.service';

@Component({
  selector: 'app-plan-dialog',
  templateUrl: './plan-dialog.component.html',
  styleUrls: ['./plan-dialog.component.scss']
})
export class PlanDialogComponent implements OnInit {
  dialogRef: DialogComponent;
  data: any;
  planForm: any;
  regionList: any = [];
  title: string = 'Add New Plan';
  constructor(
    private viewContainer: ViewContainerRef,
    private regionService: RegionsService,
    private planService: PlansService) {
    const _injector = this.viewContainer.injector;
    this.dialogRef = _injector.get<DialogComponent>(DialogComponent);
  }
  
  
  ngOnInit(): void {
    this.data = this.dialogRef.context.data;
    this.title = this.dialogRef.context.title;
    this.createPlanForm();
    this.getAllRegions();
  }
  getAllRegions(): void {
    this.regionService.getAllRegions()
    .subscribe(
      res => {
        console.log(res);
        this.regionList = res;
      }, err => {
        console.log(err);
      }
    )
  }

  createPlanForm(): void {
    this.planForm = new FormGroup({
      name: new FormControl(this.data?.name, [Validators.required]),
      dataSize: new FormControl(this.data?.dataSize, [Validators.required]),
      validity: new FormControl(this.data?.validity, [Validators.required]),
      sms: new FormControl(this.data?.sms, [Validators.required]),
      voice: new FormControl(this.data?.voice, [Validators.required]),
      regionId: new FormControl(this.data?.regionId, [Validators.required]),
    });
  }
  submit() {
    if (this.title === 'Edit User') {
      this.update();
    } else {
      this.createUser();
    }
  }
  createUser() {
    this.planService.createPlan(this.planForm.value)
    .subscribe( (res: any) => {
      console.log(res);
      this.dialogRef.close.emit(res);
    }, err => {
      alert(err.error.message);
    })
  }
  update() {
    this.planService.updatePlan(this.data._id, this.planForm.value)
    .subscribe( (res: any) => {
      this.dialogRef.close.emit(res);
    }, err => {
      console.log(err);
    })
  }
  close(): void {
    // this.data.amount = 343;
    this.dialogRef.close.emit(false);
  }
}
