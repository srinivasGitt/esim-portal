import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { DialogComponent } from '../../service/dialog';
import { PlansService } from '../../service/plans.service';
import { RegionsService } from '../../service/regions.service';
import { subscriberService } from '../../service/subscriber.service';
import { AlertService } from '../../service/alert.service';

@Component({
  selector: 'app-subscriber-mgmt',
  templateUrl: './subscriber-mgmt.component.html',
  styleUrls: ['./subscriber-mgmt.component.scss']
})
export class SubscriberMgmtComponent implements OnInit {
  dialogRef: DialogComponent;
  data: any;
  subscriberForm: any;
  title: string = 'Add New Subscriber';
  regionList: any = [];
  planList: any = [];
  submitted = false;
  planDetails: any;
  buttonLabel: any = 'Invite';
  constructor(
    private viewContainer: ViewContainerRef,
    private regionService: RegionsService,
    private planService: PlansService,
    private subscriberService: subscriberService,
    private alertService: AlertService) {
    const _injector = this.viewContainer.injector;
    this.dialogRef = _injector.get<DialogComponent>(DialogComponent);
  }
  ngOnInit(): void {
    this.data = this.dialogRef.context.data;
    this.title = this.dialogRef.context.title;
    this.createsubscriberForm();
    this.getAllRegions();
    this.getAlPlans();
    if(this.title === 'Edit Subscriber'){
      this.buttonLabel = 'Update'
    }
  }

  getAllRegions(): void {
    this.regionService.getAllRegions()
    .subscribe(
      (res:any) => {
        this.regionList = res;
      }, err => {
        this.alertService.error(err.error.message);
      }
    )
  }

  fetchPlans() {
    this.planService.fetchPlansByRegion(this.subscriberForm.get('regionId').value)
    .subscribe(
      res => {
        this.planList = res;
        const planId = this.subscriberForm.get('planId').value;
        const plan = this.planList.find((o:any)=>o._id === planId);
        if(this.data._id){
          this.planDetails = plan;
        }
      }, err => {
        this.alertService.error(err.error.message, err.status);
      }
    )
  }
  getAlPlans(): void {
    this.planService.listPlans()
    .subscribe(
      res => {
        this.planList = res;
        const planId = this.subscriberForm.get('planId').value;
        const plan = this.planList.find((o:any)=>o._id === planId);
        if(this.data._id){
          this.planDetails = plan;
        }
      }, err => {
        this.alertService.error(err.error.message, err.status);
      }
    )
  }

  createsubscriberForm() {
    this.subscriberForm = new UntypedFormGroup({
      email: new UntypedFormControl(this.title === 'Edit Subscriber' ? {value: this.data?.email, disabled: true} : this.data?.email, [Validators.required, Validators.email]),
      firstName: new UntypedFormControl(this.data?.firstName, [Validators.required]),
      lastName: new UntypedFormControl(this.data?.lastName, [Validators.required]),
      regionId: new UntypedFormControl(this.data?.regionId, [Validators.required, Validators.min(1)]),
      planId: new UntypedFormControl(this.data?.planId, [Validators.required]),
      endDate: new UntypedFormControl(this.data?.endDate, [Validators.required]),
    });
  }

  get f() { return this.subscriberForm.controls; }

  submit() {
    this.submitted = true;
    if (this.subscriberForm.invalid) {
      return;
    }
    if (this.title === 'Edit Subscriber') {
      this.update();
    } else {
      this.createSubscriber();
    }
  }

  createSubscriber() {
    this.subscriberService.createSubscriber(this.subscriberForm.value)
    .subscribe((res: any) => {
      this.dialogRef.close.emit(res);
    }, err => {
      this.alertService.error(err.error.message, err.status);
    })
  }

  update() {
    this.subscriberService.updateSubscriber(this.data._id, this.subscriberForm.value)
    .subscribe( (res: any) => {
      this.dialogRef.close.emit(res);
    }, err => {
      this.alertService.error(err.error.message, err.status);
    })
  }

  assignPlan(){
    const planId = this.subscriberForm.get('planId').value;
    const plan = this.planList.find((o:any)=>o._id === planId);
    this.planDetails = plan;
    if(plan){
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + plan.validity);
      this.subscriberForm.get('endDate').setValue(endDate);
    }
  }
  
  close(): void {
    this.dialogRef.close.emit();
  }

}
