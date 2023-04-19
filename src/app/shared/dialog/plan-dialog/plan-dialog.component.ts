import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { DialogComponent } from '../../service/dialog';
import { PlansService } from '../../service/plans.service';
import { RegionsService } from '../../service/regions.service';
import { AlertService } from '../../service/alert.service';
import * as Country from 'world-countries';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-plan-dialog',
  templateUrl: './plan-dialog.component.html',
  styleUrls: ['./plan-dialog.component.scss']
})
export class PlanDialogComponent implements OnInit {
  dialogRef: DialogComponent;
  data: any;
  planForm: any;
  countryList: any = [];
  submitted = false;
  title: string = 'Add New Plan';
  currentDate = new Date().toISOString().slice(0, 10);
  inProgress: boolean = false;
  dataDropdown: string[] = ['MB', 'GB', 'TB']
  validityDropdown: string[] = ['days', 'months', 'year']

  constructor(
    private viewContainer: ViewContainerRef,
    private regionService: RegionsService,
    private planService: PlansService,
    private alertService: AlertService,
    public datepipe: DatePipe) {
    const _injector = this.viewContainer.injector;
    this.dialogRef = _injector.get<DialogComponent>(DialogComponent);
  }
  
  
  ngOnInit(): void {
    this.data = this.dialogRef.context.data;
    this.title = this.dialogRef.context.title;
    this.inProgress = true
    this.createPlanForm();
    this.countryList = Country.default
    this.countryList = this.countryList.sort((a:any,b:any) => a.name.common.localeCompare(b.name.common))
    this.countryList.forEach((country: any) => {
      let flagNameInLower = country.cca3
      flagNameInLower = flagNameInLower.toLowerCase()
      country.flag = `assets/flags/${flagNameInLower}.svg`
      this.inProgress = false
    })
    
  }
  

  createPlanForm(): void {
    // this.planForm = new UntypedFormGroup({
    //   name: new UntypedFormControl(this.data?.name, [Validators.required]),
    //   dataUnit: new UntypedFormControl(this.data?.dataUnit || 'GB', [Validators.required]),
    //   dataSize: new UntypedFormControl(this.data?.dataSize, [Validators.required]),
    //   validityUnit: new UntypedFormControl(this.data?.validityUnit || 'days', [Validators.required]),
    //   validity: new UntypedFormControl(this.data?.validity, [Validators.required]),
    //   smsPerDay: new UntypedFormControl(this.data?.smsPerDay, [Validators.required]),
    //   unlimited: new UntypedFormControl(this.data?.unlimited),
    //   voice: new UntypedFormControl(this.data?.voice, [Validators.required]),
    //   supportedCountries: new UntypedFormControl(this.data?.supportedCountries, [Validators.required]),
    //   cost: new UntypedFormControl(this.data?.cost, [Validators.required]),
    //   dateEarliestActivation: new UntypedFormControl(this.data?.dateEarliestActivation, [Validators.required]),
    //   dateLatestAvailable: new UntypedFormControl(this.data?.dateLatestAvailable, [Validators.required]),
    //   dateEarliestAvailable: new UntypedFormControl(this.data?.dateEarliestAvailable, [Validators.required])
    // });
    this.planForm = new UntypedFormGroup({
      name: new UntypedFormControl('', [Validators.required]),
      dataUnit: new UntypedFormControl('GB', [Validators.required]),
      dataSize: new UntypedFormControl(0, [Validators.required]),
      validityUnit: new UntypedFormControl('days', [Validators.required]),
      validity: new UntypedFormControl(0, [Validators.required]),
      smsPerDay: new UntypedFormControl(0, [Validators.required]),
      unlimited: new UntypedFormControl(false),
      voice: new UntypedFormControl(0, [Validators.required]),
      supportedCountries: new UntypedFormControl('', [Validators.required]),
      priceBundle: new UntypedFormControl(0, [Validators.required]),
      dateEarliestActivation: new UntypedFormControl('', [Validators.required]),
      dateLatestAvailable: new UntypedFormControl('', [Validators.required]),
      dateEarliestAvailable: new UntypedFormControl('', [Validators.required])
    });
  }

  get f() { return this.planForm.controls; }

  submit() {
    this.submitted = true;

    if(this.planForm.value.unlimited) {
      this.planForm.value.voice = 0
    }

    if (this.planForm.invalid) {
      return;
    }
    // if (this.title === 'Edit Plan') {
    //   this.update();
    // } else {
    //   this.createPlan();
    // }
    this.createPlan();
  }

  /* create a new plan */
  createPlan() {

    const plan = this.planForm.value

    if(plan.unlimited) {
      plan.voice = 0
    }

    const obj = {
      name : plan.name,
      data : `${plan.dataSize} ${plan.dataUnit}`,
      unlimited: plan.unlimited,
      smsBundleIncludeQuantity : plan.smsPerDay,
      voiceBundleIncludeQuantity: plan.voice,
      cycle : plan.validity,
      cycleUnits : plan.validityUnit,
      priceBundle : plan.priceBundle,
      supportedCountries : plan.supportedCountries,
      dateEarliestActivation : new Date(plan.dateEarliestActivation).getTime(),
      dateLatestAvailable : new Date(plan.dateLatestAvailable).getTime(),
      dateEarliestAvailable : new Date(plan.dateEarliestAvailable).getTime(),
    }

    console.log(obj)

    this.planService.createPlan(obj)
    .subscribe( (res: any) => {
      this.dialogRef.close.emit(res);
    }, err => {
      this.alertService.error(err.error.message);
    })
  }

  /* update an existing plan */
  // update() {
  //   this.planService.updatePlan(this.data._id, this.planForm.value)
  //   .subscribe( (res: any) => {
  //     this.dialogRef.close.emit(res);
  //   }, err => {
  //     this.alertService.error(err.error.message);
  //   })
  // }

  /* close modal */
  close(): void {
    // this.data.amount = 343;
    this.dialogRef.close.emit(false);
  }

  /* increment and decrement input values */
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
