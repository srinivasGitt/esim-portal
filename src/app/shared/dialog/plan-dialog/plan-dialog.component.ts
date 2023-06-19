import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { DialogComponent } from '../../service/dialog';
import { PlansService } from '../../service/plans.service';
import { RegionsService } from '../../service/regions.service';
import { AlertService } from '../../service/alert.service';
import * as Country from 'world-countries';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';


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
  countriesAlias: any[] = []
  imsiTypeList: any[] = [];
  selectedCountries: any[] = [];
  selectedIMSIType!: number;
  currencyType: string = 'USD';

  constructor(
    private viewContainer: ViewContainerRef,
    private planService: PlansService,
    private alertService: AlertService,
    public datepipe: DatePipe) {
    const _injector = this.viewContainer.injector;
    this.dialogRef = _injector.get<DialogComponent>(DialogComponent);
  }
  
  
  ngOnInit(): void {
    this.currencyType = localStorage.getItem('currency')!;
    this.data = this.dialogRef.context.data;
    this.title = this.dialogRef.context.title;
    this.inProgress = true
    this.createPlanForm();
    this.countryList = Country.default
    this.countryList = this.countryList.filter((x: any) => x.independent).sort((a:any,b:any) => a.name.common.localeCompare(b.name.common))
    this.countryList.forEach((country: any) => {
      let flagNameInLower = country.cca3
      flagNameInLower = flagNameInLower.toLowerCase()
      country.flag = `assets/flags/${flagNameInLower}.svg` 
      this.countriesAlias.push({name: country.name.common, flag: country.flag, cca3: country.cca3})
      this.inProgress = false
    })
    
    this.planService.getIMSITypeList().subscribe((res: any) => { 
      if(res.code == 200){
        this.imsiTypeList = res.data
        this.imsiTypeList.forEach((res: any) => res.label = "IMSI " + res._id)
      }
    });
    
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
      // smsPerDay: new UntypedFormControl(0, [Validators.required]),
      // unlimited: new UntypedFormControl(false),
      // voice: new UntypedFormControl(0, [Validators.required]),
      supportedCountries: new UntypedFormControl('', [Validators.required]),
      priceBundle: new UntypedFormControl(0, [Validators.required]),
      imsiType: new UntypedFormControl(null, [Validators.required]),
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


  /* Select Supported Countries */
  onCountryChange($event: any) {
    this.selectedCountries = $event
  }

  /* create a new plan */
  createPlan() {
    this.inProgress = true;
    const plan = this.planForm.value
    if(plan.unlimited) {
      plan.voice = 0
    }

    const obj = {
      name : plan.name,
      data : `${parseInt(plan.dataSize)} ${plan.dataUnit}`,
      unlimited: plan.unlimited,
      smsBundleIncludeQuantity : 0,
      voiceBundleIncludeQuantity: 0,
      cycle : parseInt(plan.validity),
      cycleUnits : plan.validityUnit,
      priceBundle : parseInt(plan.priceBundle),
      supportedCountries : this.selectedCountries,
      dateEarliestActivation : new Date(plan.dateEarliestActivation).getTime(),
      dateLatestAvailable : new Date(plan.dateLatestAvailable).getTime(),
      dateEarliestAvailable : new Date(plan.dateEarliestAvailable).getTime(),
      preferredImsiId: plan.imsiType
    }

    this.planService.createPlan(obj)
    .subscribe( (res: any) => {
      this.dialogRef.close.emit(res);
      this.inProgress = true;
    }, err => {
      this.alertService.error(err.error.message, err.status);
      this.inProgress = false;
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

  displayContryList(countries: any){
    return countries.map((country: any) => country.name).slice(2).join(', ');
  }

  /* Restrict user to enter alphabets in mobile field */
  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

}
