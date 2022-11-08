import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { DialogComponent } from '../../service/dialog';
import { PlansService } from '../../service/plans.service';
import { RegionsService } from '../../service/regions.service';
import { subscriberService } from '../../service/subscriber.service';

@Component({
  selector: 'app-subscriber-mgmt',
  templateUrl: './subscriber-mgmt.component.html',
  styleUrls: ['./subscriber-mgmt.component.scss']
})
export class SubscriberMgmtComponent implements OnInit {
  dialogRef: DialogComponent;
  data: any;
  subscriberForm: any;
  title: string = 'Add New User';
  regionList: any = [];
  planList: any = [];

  constructor(
    private viewContainer: ViewContainerRef,
    private regionService: RegionsService,
    private planService: PlansService,
    private subscriberService: subscriberService) {
    const _injector = this.viewContainer.injector;
    this.dialogRef = _injector.get<DialogComponent>(DialogComponent);
  }
  ngOnInit(): void {
    this.data = this.dialogRef.context.data;
    this.title = this.dialogRef.context.title;
    this.createsubscriberForm();
    this.getAllRegions();
    this.getAlPlans();
  }

  getAllRegions(): void {
    this.regionService.getAllRegions()
    .subscribe(
      (res:any) => {
        console.log(res);
        this.regionList = res;
      }, err => {
        console.log(err);
      }
    )
  }

  getAlPlans(): void {
    this.planService.listPlans()
    .subscribe(
      res => {
        console.log(res);
        this.planList = res;
      }, err => {
        console.log(err);
      }
    )
  }

  createsubscriberForm() {
    // console.log(this.data?.amount);
    this.subscriberForm = new UntypedFormGroup({
      email: new UntypedFormControl(this.data?.email, [Validators.required, Validators.email]),
      firstName: new UntypedFormControl(this.data?.firstName, [Validators.required]),
      lastName: new UntypedFormControl(this.data?.lastName, [Validators.required]),
      regionId: new UntypedFormControl(this.data?.regionId, [Validators.required]),
      planId: new UntypedFormControl(this.data?.planId, [Validators.required]),
      endDate: new UntypedFormControl(this.data?.endDate, [Validators.required]),
      mobile: new UntypedFormControl(this.data?.mobile, [Validators.required]),
    });
  }

  submit() {
    if (this.title === 'Edit User') {
      this.update();
    } else {
      this.createSubscriber();
    }
  }

  createSubscriber() {
    this.subscriberService.createSubscriber(this.subscriberForm.value)
    .subscribe((res: any) => {
      console.log(res);
      this.dialogRef.close.emit(res);
    }, err => {
      alert(err.error.message);
    })
  }

  update() {
    this.subscriberService.updateSubscriber(this.data._id, this.subscriberForm.value)
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
