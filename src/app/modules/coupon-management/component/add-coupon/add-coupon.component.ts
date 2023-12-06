import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DialogComponent } from 'src/app/shared/service/dialog';
import { StepperService } from '../../service/stepper.service';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { CouponManagementService } from '../../service/coupon-management.service';
import { combineLatest } from 'rxjs';
import { AlertService, DashboardService } from 'src/app/shared/service';
import { NgSelectComponent } from '@ng-select/ng-select';

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
  selector: 'app-add-coupon',
  templateUrl: './add-coupon.component.html',
  styleUrls: ['./add-coupon.component.scss'],
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

export class AddCouponComponent implements OnInit {
  
  dialogRef: DialogComponent;
  currentDate = new Date().toISOString().slice(0, 10);
  currentStep: number = 0;
  
  // stepper
  stepCountArray: Array<number> = [1, 2, 3];
  
  // Arrays declaration
  list: Array<any> = [];
  plansList: Array<any> = [];
  regionList: Array<any> = [
    { name: 'Africa', flag: 'assets/regions/africa.svg'},
    { name: 'Asia', flag: 'assets/regions/asia.svg'},
    { name: 'Europe', flag: 'assets/regions/europe.svg'},
    { name: 'North America', flag: 'assets/regions/north-america.svg'},
    { name: 'South America', flag: 'assets/regions/south-america.svg'},
    { name: 'Oceania', flag: 'assets/regions/oceania.svg'}
  ];
  countryList: Array<any> = [];
  countriesAlias: Array<any> = [];
  
  placeholderText: string = 'Search for plans / Multiple plans can be selected';
  @ViewChild('ngSelectComponent') ngSelectComponent!: NgSelectComponent;

  // Form declaration & initialization
  couponForm = new FormGroup({
    stepOne: new FormGroup({
      code: new FormControl(null),
      discountType: new FormControl('fixed'),
      discountValue: new FormControl(0)
    }),
    stepTwo: new FormGroup({
      startDate: new FormControl(null),
      endDate: new FormControl(null),
      total: new FormControl(0),
      minPurchaseValue: new FormControl(0),
      maxPurchaseValue: new FormControl(0),
      useType: new FormControl('single'),
      totalUse: new FormControl(0),
      totalUseType: new FormControl('limited')
    }),
    stepThree: new FormGroup({
      applicableType: new FormControl('plan'),
      applicableValue: new FormControl(null)
    })
  });

  // Flags
  inProgress: boolean = false;
  isCountry: boolean = false;
  isRegion: boolean = false;
  isPlan: boolean = false;
  isDarkTheme!: boolean;

  constructor(private viewContainer: ViewContainerRef, 
              private stepperService: StepperService,
              private couponService: CouponManagementService,
              private alertService: AlertService,
              private dashboardService: DashboardService) {
                dashboardService.getAppTheme().subscribe((data : any) =>{
                  this.isDarkTheme = data; 
                }); 
    const _injector = this.viewContainer.injector;
    this.dialogRef = _injector.get<DialogComponent>(DialogComponent);


    this.couponForm.get('stepThree.applicableType')?.valueChanges.subscribe((data: any) => {     

      const configMap: any = {
        'plan': {
          placeholderText: 'Search for plans / Multiple plans can be selected',
          list: this.plansList,
          isPlan: true,
          isRegion: false,
          isCountry: false,
        },
        'region': {
          placeholderText: 'Search for regions / Multiple regions can be selected',
          list: this.regionList,
          isPlan: false,
          isRegion: true,
          isCountry: false,
        },
        'country': {
          placeholderText: 'Search for countries / Multiple countries can be selected',
          list: this.countriesAlias,
          isPlan: false,
          isRegion: false,
          isCountry: true,
        }
      };
      
      const config = configMap[data];
      
      if (config) {
        this.updateView(config);
      } else {
        // Handle default case if needed
      }

      this.ngSelectComponent.clearModel(); 
    });
  }

  private updateView(config: any): void {
    this.placeholderText = config.placeholderText;
    this.list = config.list;
    this.isPlan = config.isPlan;
    this.isRegion = config.isRegion;
    this.isCountry = config.isCountry;
  }

  ngOnInit(): void {
    this.getData();

    // Initialize the current step
    this.stepperService.currentStep$.subscribe((step) => {
      this.currentStep = step;
    });
  }
  
  displayList(items: any){
    return items.map((country: any) => country.name).slice(2).join(', ');
  }

  getData() {
    this.inProgress = true;
    combineLatest(this.couponService.getDropdownData()).subscribe((result : any) => { 
      if(result) {
        console.log(result)
        this.plansList = result[0].data;
        // this.regionList = result[1].data;
        this.countryList = result[1].data;

        this.list = this.plansList;

        this.countryList = this.countryList.sort((a: any, b: any) => a.name.localeCompare(b.name));
        this.countryList.forEach((country: any) => {
          let flagNameInLower = country.iso3code
          flagNameInLower = flagNameInLower.toLowerCase()
          country.flag = `assets/flags/${flagNameInLower}.svg` 
          this.countriesAlias.push({name: country.name, flag: country.flag, iso3code: country.iso3code, dial_code: country.dial_code})
        })

        this.inProgress = false;
      }
    },
    error => {
      this.inProgress = false;
      this.alertService.error(error.error.message);
    }
    );
    
  }

  submit() {
    console.log(this.couponForm.value);

    this.stepperService.resetStep();
  }
  
  nextStep(): void {
    this.stepperService.updateStep(this.currentStep + 1);
  }

  previousStep(): void {
    this.stepperService.updateStep(this.currentStep - 1);
  }

  /* close modal */
  close(): void {
    this.dialogRef.close.emit(false);
  }
  
}
