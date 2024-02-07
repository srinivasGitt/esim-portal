import { DatePipe, getCurrencySymbol } from '@angular/common';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter
} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { combineLatest } from 'rxjs';
import { AlertService } from '../../service/alert.service';
import { DialogComponent } from '../../service/dialog';
import { PlansService } from '../../service/plans.service';

const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-plan-dialog',
  templateUrl: './plan-dialog.component.html',
  styleUrls: ['./plan-dialog.component.scss'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'en-IN'},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
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
  selectedRegion!: string;
  isCountry: boolean = false;
  regionList: any[] = []
  err!: string;
  isErr: boolean = false;
  currencyType: string = 'USD';
  activationType: any[] = [{name: 'API'}, {name: 'PDP'}]

  constructor(
    private viewContainer: ViewContainerRef,
    private planService: PlansService,
    private alertService: AlertService,
    public datepipe: DatePipe) {
    const _injector = this.viewContainer.injector;
    this.dialogRef = _injector.get<DialogComponent>(DialogComponent);
  }


  ngOnInit(): void {
    this.currencyType = getCurrencySymbol(localStorage.getItem('currency')!, 'wide') ?? getCurrencySymbol('USD', 'wide');
    this.data = this.dialogRef.context.data;
    console.log(this.data);
    this.title = this.dialogRef.context.title;
    this.inProgress = true
    this.createPlanForm();
    this.getIMSIAndCountryList();
  }


  getIMSIAndCountryList() {
    combineLatest(this.planService.getIMSIAndCountryList()).subscribe((result : any) => {
      if(result) {

        const imsi = result[0]
        const countries = result[1]
        const regions = result[2]

        this.imsiTypeList = imsi.data
        this.regionList = regions.data
        this.countryList = countries.data

        this.imsiTypeList = this.imsiTypeList.sort((a:any,b:any) => a._id - b._id)
        this.imsiTypeList.forEach((res: any) => res.label = "IMSI " + res._id)

        this.countryList = this.countryList.sort((a: any, b: any) => a.name.localeCompare(b.name));
        this.countryList.forEach((country: any) => {
          let flagNameInLower = country.iso3code
          flagNameInLower = flagNameInLower.toLowerCase()
          country.flag = `assets/flags/${flagNameInLower}.svg`
          this.countriesAlias.push({name: country.name, flag: country.flag, iso3code: country.iso3code, dial_code: country.dial_code})
        })
        this.inProgress = false

      }

    })
  }

  createPlanForm(): void {
    let dataSize;
    if(this.data) {
      if(this.data.data) {
        dataSize = this.data.data.split(" ");
      }
    }

    console.log(this.data.supportedCountries);
    this.selectedCountries = this.data.supportedCountries
    this.planForm = new UntypedFormGroup({
      productCategory: new UntypedFormControl(this.data.productCategory ? this.data.productCategory : '', [Validators.maxLength(80)]),
      name: new UntypedFormControl(this.data.name, [Validators.required, Validators.maxLength(80)]),
      dataUnit: new UntypedFormControl(dataSize ? dataSize[1] : 'GB', [Validators.required]),
      dataSize: new UntypedFormControl(dataSize ? dataSize[0] : 0, [Validators.required]),
      validityUnit: new UntypedFormControl(this.data.cycleUnits ? (this.data.cycleUnits === 'day' ? 'days' : this.data.cycleUnits) : 'days', [Validators.required]),
      validity: new UntypedFormControl(this.data.cycle ? this.data.cycle : 0, [Validators.required]),
      activationType: new UntypedFormControl(this.data.activationType ? this.data.activationType : 'PDP', [Validators.required]),
      region: new UntypedFormControl(this.data.groupId ? this.data.groupId : null),
      supportedCountries: new UntypedFormControl(this.data.supportedCountries ? this.data.supportedCountries : ''),
      priceBundle: new UntypedFormControl(this.data.priceBundle ? this.data.priceBundle : 0, [Validators.required]),
      imsiType: new UntypedFormControl( this.data.preferredImsiId ? this.data.preferredImsiId : null, [Validators.required]),
      dateEarliestActivation: new UntypedFormControl(this.data.dateEarliestActivation ? new Date(this.data.dateEarliestActivation) : '', [Validators.required]),
      dateLatestAvailable: new UntypedFormControl(this.data.dateLatestAvailable ? new Date(this.data.dateLatestAvailable) : '', [Validators.required]),
      dateEarliestAvailable: new UntypedFormControl(this.data.dateEarliestAvailable ? new Date(this.data.dateEarliestAvailable) : '', [Validators.required])
    });
  }

  get f() { return this.planForm.controls; }

  /* Comparing Selected Countries with the list of countries in Edit Plan Mode */
  compareCountries(country: any, selectedCountry: any): boolean {
    return country.name === selectedCountry.name
  }

  submit() {
    this.submitted = true;

    if(this.planForm.value.unlimited) {
      this.planForm.value.voice = 0
    }

    if (this.planForm.invalid) {
      return;
    }
    if(this.planForm.value.region == null && this.planForm.value.supportedCountries.length == 0) {
      this.isErr = true;
      this.err = 'Either Region or Country is required'
      return
    }
    this.createPlan();
  }


  /* Select Supported Countries */
  onCountryChange($event: any) {
    this.selectedCountries = $event
    this.selectedCountries.length > 0 ? this.isCountry = true : this.isCountry = false;
    this.isErr = false;
  }

  /* create a new plan */
  createPlan() {
    this.inProgress = true;
    const plan = this.planForm.value
    if(plan.unlimited) {
      plan.voice = 0
    }

    const obj = {
      productCategory: plan.productCategory,
      name : plan.name,
      data : `${parseInt(plan.dataSize)} ${plan.dataUnit}`,
      unlimited: plan.unlimited,
      smsBundleIncludeQuantity : 0,
      voiceBundleIncludeQuantity: 0,
      cycle : parseInt(plan.validity),
      cycleUnits : plan.validityUnit,
      priceBundle : parseInt(plan.priceBundle),
      activationType: plan.activationType,
      groupId: plan.region,
      supportedCountries : this.selectedCountries,
      dateEarliestActivation : new Date(plan.dateEarliestActivation).getTime(),
      dateLatestAvailable : new Date(plan.dateLatestAvailable).getTime(),
      dateEarliestAvailable : new Date(plan.dateEarliestAvailable).getTime(),
      preferredImsiId: this.selectedIMSIType,
      isCountry: plan.region == null ? true : false
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


  /* close modal */
  close(): void {
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

  selectIMSI(value: any) {
    if(value) {
      this.selectedIMSIType = value._id
    }
  }

  selectRegion(value: any) {
    if(value) {
      this.selectedRegion = value.label
    }

    this.selectedRegion != null ? this.isCountry = true : this.isCountry = false;
    this.isErr = false;
  }

  /* Restrict user to enter alphabets in mobile field */
  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }


  /* Restrict user to enter only numbers and decimal point */
  numberWithDecimalOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}
