import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { DialogComponent } from '../../service/dialog';
import { PlansService } from '../../service/plans.service';
import { RegionsService } from '../../service/regions.service';
import { AlertService } from '../../service/alert.service';

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
  submitted = false;
  title: string = 'Add New Plan';

  constructor(
    private viewContainer: ViewContainerRef,
    private regionService: RegionsService,
    private planService: PlansService,
    private alertService: AlertService) {
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
        this.regionList = res;
      }, err => {
        this.alertService.error(err.error.message);
      }
    )
  }

  createPlanForm(): void {
    this.planForm = new UntypedFormGroup({
      name: new UntypedFormControl(this.data?.name, [Validators.required]),
      dataSize: new UntypedFormControl(this.data?.dataSize, [Validators.required]),
      validity: new UntypedFormControl(this.data?.validity, [Validators.required]),
      sms: new UntypedFormControl(this.data?.sms, [Validators.required]),
      voice: new UntypedFormControl(this.data?.voice, [Validators.required]),
      regionId: new UntypedFormControl(this.data?.regionId, [Validators.required]),
      cost: new UntypedFormControl(this.data?.cost, [Validators.required]),
    });
  }

  get f() { return this.planForm.controls; }

  submit() {
    this.submitted = true;
    if (this.planForm.invalid) {
      return;
    }
    if (this.title === 'Edit Plan') {
      this.update();
    } else {
      this.createUser();
    }
  }
  createUser() {
    this.planService.createPlan(this.planForm.value)
    .subscribe( (res: any) => {
      this.dialogRef.close.emit(res);
    }, err => {
      this.alertService.error(err.error.message);
    })
  }
  update() {
    this.planService.updatePlan(this.data._id, this.planForm.value)
    .subscribe( (res: any) => {
      this.dialogRef.close.emit(res);
    }, err => {
      this.alertService.error(err.error.message);
    })
  }
  close(): void {
    // this.data.amount = 343;
    this.dialogRef.close.emit(false);
  }
}
