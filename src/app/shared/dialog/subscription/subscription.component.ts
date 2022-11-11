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
    console.log(this.data?.amount);
    this.subscriptionForm = new UntypedFormGroup({
      // subscriptionNumber: new UntypedFormControl(this.data?.subscriptionNumber, [Validators.required]),
      amount: new UntypedFormControl({value:this.data?.amount, disabled: true}, [Validators.required],),
      startDate: new UntypedFormControl({value:this.data?.startDate, disabled: true}, [Validators.required]),
      endDate: new UntypedFormControl({value:this.data?.endDate, disabled: true}, [Validators.required]),
      planId: new UntypedFormControl(this.data?.planId, [Validators.required]),
      userEmail: new UntypedFormControl('', [Validators.required, Validators.email]),
    });
  }

  get f() { return this.subscriptionForm.controls; }

  submit() {
    this.dialogRef.close.emit(this.subscriptionForm.value); 
    // console.log(this.subscriptionForm);
    // console.log(this.subscriptionForm.value);
  }
  getAllPlanId(){
    this.planService.listPlans()
    .subscribe(
      res => {
        console.log(res);
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
      // this.subscriptionForm.controls(['amount']).setValue(plan.cost);
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + plan.validity);
      this.subscriptionForm.get('endDate').setValue(endDate);
      this.subscriptionForm.get('startDate').setValue(new Date());
      console.log(this.subscriptionForm.value)
    }
  }

  getUserId(){
    this.subscriberService.getAllSubscriber()
    .subscribe(
      res => {
        console.log(res);
        this.subscribeList = res;
      }, err => {
        this.alertService.error(err.error.message);
      }
    )
  }
  close(flag: boolean): void {
    // this.data.amount = 343;
    this.dialogRef.close.emit(false);
  }
}