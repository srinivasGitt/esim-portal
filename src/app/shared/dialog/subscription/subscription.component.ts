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

  title: string = 'Add New Subscription';
  planList: any = [];
  subscribeList: any = [];
  currentDate = new Date().toISOString().slice(0, 10);

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
      planId: new UntypedFormControl(null, [Validators.required]),
      subscriberId: new UntypedFormControl(null, [Validators.required],),
      startDate: new UntypedFormControl(null, [Validators.required]),
      endDate: new UntypedFormControl(null, [Validators.required]),
      priceBundle: new UntypedFormControl(null, [Validators.required]),
      data: new UntypedFormControl(null, [Validators.required]),
    });
  }

  get f() { return this.subscriptionForm.controls; }

  getUserId(){
    this.subscriberService.getAllSubscriber()
    .subscribe(
      (res : any) => {
        this.subscribeList = res.data;
        console.log(res)
      }, err => {
        this.alertService.error(err.error.message);
      }
    )
  }
  
  getAllPlanId(){
    this.planService.listPlans()
    .subscribe(
      (res: any) => {
        this.planList = res.data;
        console.log(res)
      }, err => {
        this.alertService.error(err.error.message);
      }
    )
  }

  onPlanSelect(event: any) { 
    if(event) {
      this.f.startDate.setValue(this.currentDate)
      this.f.priceBundle.setValue(event.priceBundle)
      this.f.data.setValue(event.data)
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + event.cycle);
      this.f.endDate.setValue(endDate.toISOString().slice(0, 10))
    }
  }

  onDateChange(event: any, plan: any) {
    if(plan) {
      const startDate = new Date(event.target.value)
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + plan.value.cycle);
      this.f.endDate.setValue(endDate.toISOString().slice(0, 10))
    }   
  }

  submit() {
    this.submitted = true;
    this.subscriptionForm.value.planId = this.subscriptionForm.value.planId._id
    this.subscriptionForm.value.subscriberId = this.subscriptionForm.value.subscriberId._id
    
    if (this.subscriptionForm.invalid) {
      return
    } 
    this.dialogRef.close.emit(this.subscriptionForm.value);
  }

  // assignPlan(){
  //   const planId = this.subscriptionForm.get('planId').value;
  //   const plan = this.planList.find((o:any)=>o._id === planId);
  //   if(plan){
  //     this.subscriptionForm.get('amount').setValue(plan.cost);
  //     const endDate = new Date();
  //     endDate.setDate(endDate.getDate() + plan.validity);
  //     this.subscriptionForm.get('endDate').setValue(endDate);
  //     this.subscriptionForm.get('startDate').setValue(new Date());
  //   }
  // }

  

  close(): void {
    this.dialogRef.close.emit(false);
  }

  updateValue(controlKey: string, updateBy: string){
    if(updateBy == 'inc'){
      let incValue = isNaN(parseInt(this.f[controlKey].value)) ? 0 : parseInt(this.f[controlKey].value);
      this.f[controlKey].setValue(++incValue);
    } else if(updateBy == 'dec'){
      let decValue = isNaN(parseInt(this.f[controlKey].value)) ? 1 : parseInt(this.f[controlKey].value);
      if(--decValue > -1){
        this.f[controlKey].setValue(decValue);
      }
      
    }
  }
}