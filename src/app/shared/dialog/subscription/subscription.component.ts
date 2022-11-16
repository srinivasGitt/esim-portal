import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { DialogComponent, DialogService } from '../../service/dialog';
import { PlansService } from '../../service/plans.service';
import { AlertService } from '../../service/alert.service';
import { UsersService } from '../../service/users.service';
import { subscriberService } from '../../service/subscriber.service';
@Component({
  selector: 'app-dialog-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionDialogComponent  implements OnInit {
  dialogRef: DialogComponent;
  data: any;
  subscriptionForm: any;
  submitted = false;

  title: string = 'Add Subscription';
  planList: any = [];
  subscribeList: any = [];
  constructor(
    private viewContainer: ViewContainerRef,
    private dialogService: DialogService,
    private planService: PlansService,
    private alertService: AlertService,
    private userService: UsersService,
    private subscriberService: subscriberService) {
    const _injector = this.viewContainer.injector;
    this.dialogRef = _injector.get<DialogComponent>(DialogComponent);
  }
  
  
  ngOnInit(): void {
    this.data = this.dialogRef.context.data;
    this.title = this.dialogRef.context.title;
    this.createSubscriptionForm();
    this.getAllPlanId();
    this.getUserId();
  }

  createSubscriptionForm() {
    this.subscriptionForm = new UntypedFormGroup({
      amount: new UntypedFormControl(this.data?.amount, [Validators.required],),
      startDate: new UntypedFormControl(this.data?.startDate, [Validators.required]),
      endDate: new UntypedFormControl(this.data?.endDate, [Validators.required]),
      planId: new UntypedFormControl(this.data?.planId, [Validators.required]),
      userEmail: new UntypedFormControl('', [Validators.required]),
    });
  }

  get f() { return this.subscriptionForm.controls; }

  submit() {
    this.submitted = true;
    if (this.subscriptionForm.invalid) {
      this.submitted = false;
      return
    } 
    this.dialogRef.close.emit(this.subscriptionForm.value);
  }
  getAllPlanId(){
    this.planService.listPlans()
    .subscribe(
      res => {
        this.planList = res;
      }, err => {
        this.alertService.error(err.error.message);
      }
    )
  }
  assignPlan(){
    const planId = this.subscriptionForm.get('planId').value;
    const plan = this.planList.find((o:any)=>o._id === planId);
    if(plan){
      this.subscriptionForm.get('amount').setValue(plan.cost);
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + plan.validity);
      this.subscriptionForm.get('endDate').setValue(endDate);
      this.subscriptionForm.get('startDate').setValue(new Date());
    }
  }

  getUserId(){
    this.subscriberService.getAllSubscriber()
    .subscribe(
      (res : any) => {
        console.log(res);
        this.subscribeList = res;
      }, err => {
        this.alertService.error(err.error.message);
      }
    )
  }
  close(): void {
    this.dialogRef.close.emit(false);
  }
}