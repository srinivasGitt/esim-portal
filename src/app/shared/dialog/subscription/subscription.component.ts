import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { DialogComponent } from '../../service/dialog';
import { AlertService } from '../../service/alert.service';
import { subscriberService } from '../../service/subscriber.service';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import * as moment from 'moment';
import { SubscriptionsService } from '../../service';
import { getCurrencySymbol } from '@angular/common';
@Component({
  selector: 'app-dialog-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'en-IN'},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
})
export class SubscriptionDialogComponent  implements OnInit {
  dialogRef: DialogComponent;
  data: any;
  subscriptionForm: any;
  submitted = false;

  title: string = 'Add New Subscription';
  planList: any = []

  regionId: string | null = null;
  subscribeList: any = [];
  countryList: any = []
  currentDate = moment().utc();
  showHideRegion: boolean = true;
  selectedPlan: any;
  inProgress: boolean = false;
  err: boolean = false;
  currencyType: string = 'USD';

  constructor(
    private viewContainer: ViewContainerRef,
    private alertService: AlertService,
    private subscriberService: subscriberService,
    private subscriptionService: SubscriptionsService) {
    const _injector = this.viewContainer.injector;
    this.dialogRef = _injector.get<DialogComponent>(DialogComponent);

  }
  
  ngOnInit(): void {
    this.data = this.dialogRef.context.data;
    this.title = this.dialogRef.context.title;
    this.currencyType = getCurrencySymbol(localStorage.getItem('currency')!, 'wide') ?? getCurrencySymbol('USD', 'wide');
    this.createSubscriptionForm();
    this.getPlans();
    this.getUserId();
  }

  createSubscriptionForm() {
    // this.subscriptionForm = new UntypedFormGroup({
    //   planId: new UntypedFormControl(null, [Validators.required]),
    //   subscriberId: new UntypedFormControl(null, [Validators.required],),
    //   startDate: new UntypedFormControl(null, [Validators.required]),
    //   endDate: new UntypedFormControl(null, [Validators.required]),
    //   priceBundle: new UntypedFormControl(null, [Validators.required]),
    //   data: new UntypedFormControl(null, [Validators.required]),
    // });
    this.subscriptionForm = new UntypedFormGroup({
      planId: new UntypedFormControl(null, [Validators.required]),
      regionId: new UntypedFormControl({value: null, disabled: true}),
      country: new UntypedFormControl(null),
      email: new UntypedFormControl(null, [Validators.required, Validators.email]),
      startDate: new UntypedFormControl(null, [Validators.required]),
      endDate: new UntypedFormControl('', [Validators.required]),
      priceBundle: new UntypedFormControl({value: null, disabled: true}, [Validators.required]),
      data: new UntypedFormControl({value: null, disabled: true}, [Validators.required]),
    });
  }

  get f() { return this.subscriptionForm.controls; }

  getUserId(){
    this.subscriberService.getAllSubscriber()
    .subscribe(
      (res : any) => {
        this.subscribeList = res.data;
      }, err => {
        this.alertService.error(err.error.message, err.status);
      }
    )
  }
  
  getPlans(){
    this.subscriptionService.getPlans()
    .subscribe(
      (res: any) => {
        this.planList = res.data;
      }, err => {
        this.alertService.error(err.error.message, err.status);
      }
    )
  }

  onPlanSelect(event: any) { 
    if(event) {
      console.log(event)
      this.f.startDate.setValue(this.currentDate)
      this.f.priceBundle.setValue(event.priceBundle)
      this.f.data.setValue(event.data)
      var endDate = new Date();
      // endDate.setDate(endDate.getDate() + event.cycle);
      endDate = moment(endDate).add(event.validity-1, "days").toDate();
      this.f.endDate.setValue(endDate.toISOString().slice(0, 10))
    }
  }

  onDateChange(event: any) {
    console.log(event)
    console.log(this.selectedPlan)
    if(this.selectedPlan) {
      let startDate = event.target.value;
    //   var endDate = moment(startDate).add(this.selectedPlan.validity, "days").toDate();
    // //   this.f.startDate.setValue(startDate.toISOString().slice(0, 10))
    //   this.f.endDate.setValue(endDate)

      this.f.startDate.setValue(startDate)
      var endDate = moment(startDate).add(this.selectedPlan.validity, "days").toDate();
      this.f.endDate.setValue(endDate)
    }   
  }

  submit() {
    this.submitted = true;

    if (this.subscriptionForm.invalid) {
      return
    }
    // this.dialogRef.close.emit(this.subscriptionForm.value);

    // const subscription = this.subscriptionForm.value
    
    const obj = {
      email: this.f.email.value,
      country: this.f.country.value ?? this.f.regionId.value,
      activationDate: String(this.f.startDate.value),
      expiryDate: String(this.f.endDate.value),
      planId: this.f.planId.value
    } 

    if(!this.f.regionId.value && obj && obj.country == null) {
      this.err = true
      return
    }
    this.inProgress = true;
    this.subscriptionService.createSubscription(obj)
    .subscribe((res: any) => {
      this.dialogRef.close.emit(res);
      this.inProgress = false;
      this.err = false
    }, err => {
      this.alertService.error(err.error.message, err.status);
      this.inProgress = false;
      this.err = false
    })
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

  onPlanSelection(event: any) {
    console.log(event)
    this.selectedPlan = event
    if(event == undefined) {
      this.showHideRegion = true
      this.f.regionId.setValue(null)
      this.err = false
    } 

    if(event && event.groupId) {
      this.showHideRegion = true
      this.f.regionId.setValue(event.region)
      this.countryList = null
      this.err = false
    } 
    
    if(event && !event.groupId && event.supportedCountries) {
      this.countryList = event.supportedCountries
      this.showHideRegion = false
    }
    this.f.startDate.setValue(this.currentDate.toDate())
    this.f.priceBundle.setValue(event.priceBundle)
    this.f.data.setValue(event.data)
    var endDate = moment(this.currentDate).add(event.validity, "days").toDate();
    this.f.endDate.setValue(endDate)
  }

  clearForm() {
    this.subscriptionForm.reset();
  }
}