import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DialogComponent } from 'src/app/shared/service/dialog';
import { StepperService } from '../../service/stepper.service';

import { CouponManagementService } from '../../service/coupon-management.service';
import { combineLatest } from 'rxjs';
import { AlertService, DashboardService } from 'src/app/shared/service';
import { NgSelectComponent } from '@ng-select/ng-select';
import * as moment from 'moment';

@Component({
  selector: 'app-add-coupon',
  templateUrl: './add-coupon.component.html',
  styleUrls: ['./add-coupon.component.scss'],
})
export class AddCouponComponent implements OnInit {
  dialogRef: DialogComponent;
  currentStep: number = 0;

  // stepper
  stepCountArray: Array<number> = [1, 2, 3];

  // Arrays declaration
  list: Array<any> = [];
  plansList: Array<any> = [];
  regionList: Array<any> = [];
  countryList: Array<any> = [];
  countriesAlias: Array<any> = [];

  // Form declaration & initialization
  // couponForm = new FormGroup({
  //   stepOne: new FormGroup({
  //     code: new FormControl(null, [Validators.required]),
  //     discountType: new FormControl('fixed'),
  //     discountValue: new FormControl(0, [Validators.required, Validators.min(1)])
  //   }),
  //   stepTwo: new FormGroup({
  //     startDate: new FormControl(null, [Validators.required]),
  //     endDate: new FormControl(null, [Validators.required]),
  //     total: new FormControl(0, [Validators.required, Validators.min(1)]),
  //     minPurchaseValue: new FormControl(0, Validators.min(1)),
  //     maxPurchaseValue: new FormControl(0, Validators.min(1)),
  //     useType: new FormControl('single'),
  //     totalUse: new FormControl(0),
  //     totalUseType: new FormControl('limited')
  //   }),
  //   stepThree: new FormGroup({
  //     applicableType: new FormControl('plan'),
  //     applicableValue: new FormControl(null)
  //   })
  // });
  couponForm!: FormGroup;

  // Flags
  isDarkTheme!: boolean;
  inProgress: boolean = false;

  constructor(
    private viewContainer: ViewContainerRef,
    private stepperService: StepperService,
    private alertService: AlertService,
    private dashboardService: DashboardService,
    private fb: FormBuilder,
  ) {
    dashboardService.getAppTheme().subscribe((data: any) => {
      this.isDarkTheme = data;
    });
    const _injector = this.viewContainer.injector;
    this.dialogRef = _injector.get<DialogComponent>(DialogComponent);
  }

  ngOnInit(): void {
    this.getDropdownData();
    this.initForm();
    // Initialize the current step
    this.stepperService.currentStep$.subscribe((step) => {
      this.currentStep = step;
    });
  }

  initForm() {
    this.couponForm = this.fb.group({
      stepOne: this.fb.group({
        code: [
          null,
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(12),
          ],
        ],
        discountType: ['fixedPrice'],
        discountValue: [0, [Validators.required, Validators.min(1)]],
      }),
      stepTwo: this.fb.group({
        startDate: [null, Validators.required],
        endDate: [null, Validators.required],
        total: [0, [Validators.required, Validators.min(1)]],
        minPurchaseValue: [0, Validators.min(1)],
        maxPurchaseValue: [0, Validators.min(1)],
        useType: ['single'],
        totalUse: [0],
        totalUseType: ['limited'],
      }),
      stepThree: this.fb.group({
        applicableType: ['plan'],
        applicableValue: [null],
      }),
    });
  }

  getDropdownData() {
    this.inProgress = true;
    combineLatest(this.stepperService.getDropdownData()).subscribe(
      (result: any) => {
        if (result) {
          this.plansList = result[0].data;
          this.regionList = result[1].data;
          this.countryList = result[2].data;

          this.list = this.plansList;

          this.countryList = this.countryList.sort((a: any, b: any) =>
            a.name.localeCompare(b.name),
          );
          this.countryList.forEach((country: any) => {
            let flagNameInLower = country.iso3code;
            flagNameInLower = flagNameInLower.toLowerCase();
            country.flag = `assets/flags/${flagNameInLower}.svg`;
            this.countriesAlias.push({
              name: country.name,
              flag: country.flag,
              iso3code: country.iso3code,
              dial_code: country.dial_code,
            });
          });

          this.inProgress = false;
        }
      },
      (error) => {
        this.inProgress = false;
        this.alertService.error(error.error.message);
      },
    );
  }

  onRadioButtonChange(selectedRadioValue: string) {
    // Handle the radio button value change here
    if (
      selectedRadioValue == 'fixedPrice' ||
      selectedRadioValue == 'percentage'
    ) {
      this.couponForm.get('stepOne')?.get('discountValue')?.setValue(0);
    }

    if (
      selectedRadioValue == 'single' ||
      selectedRadioValue == 'multi' ||
      selectedRadioValue == 'limited' ||
      selectedRadioValue == 'unlimited'
    ) {
      this.couponForm.get('stepTwo')?.get('totalUse')?.setValue(0);
      if (selectedRadioValue == 'multi')
        this.couponForm
          .get('stepTwo')
          ?.get('totalUseType')
          ?.setValue('limited');
      else
        this.couponForm
          .get('stepTwo')
          ?.get('totalUseType')
          ?.setValue(selectedRadioValue);
    }
  }

  /* increment and decrement input values */
  updateValue(controlKey: string, updateBy: string) {
    if (updateBy == 'inc') {
      let incValue = isNaN(parseInt(this.couponForm.get(controlKey)?.value))
        ? 0
        : parseInt(this.couponForm.get(controlKey)?.value);
      this.couponForm.get(controlKey)?.setValue(++incValue);
    } else if (updateBy == 'dec') {
      let decValue = isNaN(parseInt(this.couponForm.get(controlKey)?.value))
        ? 1
        : parseInt(this.couponForm.get(controlKey)?.value);
      if (--decValue > -1) {
        this.couponForm.get(controlKey)?.setValue(decValue);
      }
    }
  }

  submit() {
    console.log(this.couponForm.value);
    // this.inProgress = true;

    if (this.couponForm.invalid) {
      return;
    }
    const coupon = this.couponForm.value;

    const couponObj = {
      couponCode: coupon.stepOne.code,
      discount: {
        discountType: coupon.stepOne.discountType,
        value: +coupon.stepOne.discountValue,
      },
      startDate: moment(coupon.stepTwo.startDate).format('YYYY-MM-DD'),
      endDate: moment(coupon.stepTwo.endDate).format('YYYY-MM-DD'),
      numberOfCoupons: +coupon.stepTwo.total,
      minPurchaseValue: +coupon.stepTwo.minPurchaseValue,
      maxPurchaseValue: +coupon.stepTwo.maxPurchaseValue,
      useType: coupon.stepTwo.useType,
      useCount: +coupon.stepTwo.totalUse,
      couponApplicable: coupon.stepThree.applicableType,
      supportedCountries: coupon.stepThree.applicableValue,
    };

    console.log(couponObj);
    this.stepperService.saveCoupon(couponObj).subscribe((response: any) => {
      if (response) {
        this.dialogRef.close.emit(response);
        this.alertService.success(response?.message);
        this.stepperService.resetStep();
        this.inProgress = false;
      }
    },
    (error: any) => {
      this.alertService.error(error.error.message, error.status);
      this.inProgress = false;
    });
  }

  nextStep(): void {
    this.stepperService.updateStep(this.currentStep + 1);
  }

  previousStep(): void {
    this.stepperService.updateStep(this.currentStep - 1);
  }

  /* Restrict user to enter only numbers and decimal point */
  numberWithDecimalOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  /* close modal */
  close(): void {
    this.dialogRef.close.emit(false);
  }
}
