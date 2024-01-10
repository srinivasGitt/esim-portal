import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as moment from 'moment';

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
  selector: 'app-step-two',
  templateUrl: './step-two.component.html',
  styleUrls: ['./step-two.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-IN' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class StepTwoComponent implements OnInit {
  @Input() formGroupName!: string;
  form!: FormGroup;
  currentDate = new Date().toISOString().slice(0, 10);
  isDateError: boolean = false;
  isMinMaxError: boolean = false;
  isTotalUseError: boolean = false;

  constructor(
    private rootFormGroup: FormGroupDirective,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.form = this.rootFormGroup.control.get(this.formGroupName) as FormGroup;
  }

  ngAfterContentChecked(): void {
    // Checking date validation based on end date compared with start date
    this.form.get('endDate')?.valueChanges.subscribe((data: any) => {
      if (data && moment(this.form.get('startDate')?.value).isAfter(data)) {
        this.isDateError = true;
      } else {
        this.isDateError = false;
      }
    });

    // Checking date validation based on maxPurchaseValue compared with minPurchaseValue
    // this.form.get('minPurchaseValue')?.valueChanges.subscribe((data: any) => {
    //   let maxValue = Number(this.form.get('maxPurchaseValue')?.value);
    //   if (this.form.get('maxPurchaseValue')?.dirty && data > maxValue) {
    //     this.isMinMaxError = true;
    //   } else {
    //     this.isMinMaxError = false;
    //   }
    // });

    // this.form.get('maxPurchaseValue')?.valueChanges.subscribe((data: any) => {
    //   let minValue = Number(this.form.get('minPurchaseValue')?.value);
    //   if (data < minValue) {
    //     this.isMinMaxError = true;
    //   } else {
    //     this.isMinMaxError = false;
    //   }
    // });

    // Checking date validation based on maxPurchaseValue compared with minPurchaseValue
    // this.form.get('totalUse')?.valueChanges.subscribe((data: any) => {
    //   if (data <= 0) {
    //     this.isTotalUseError = true;
    //   } else {
    //     this.isTotalUseError = false;
    //   }
    // });

    this.cd.detectChanges();
  }

  onInputFocus() {
    if (this.form.get('totalUseType')?.value == 'unlimited') {
      this.form.get('totalUse')?.setValue(0);
      this.form.get('totalUseType')?.setValue('limited');
    }
  }

  onRadioButtonChange(selectedRadioValue: string) {
    // Handle the radio button value change here
    // if (selectedRadioValue == 'fixed' || selectedRadioValue == 'percentage') {
    //   this.form.get('discountValue')?.setValue(0);
    // }

    // if (selectedRadioValue == 'unlimited') {
    //   this.form.get('totalUse')?.setValue(0);
    // }

    const discountValueControl = this.form.get('discountValue');
    const totalUseControl = this.form.get('totalUse');

    switch (selectedRadioValue) {
      case 'fixed':
      case 'percentage':
        discountValueControl?.setValue(0);
        break;

      case 'single':
      case 'unlimited':
        totalUseControl?.setValue(0);
        totalUseControl?.clearValidators();
        totalUseControl?.setValidators(null);
        totalUseControl?.updateValueAndValidity();
        break;
    }
  }

  updateValidation() {
    this.form.controls['totalUse'].setValidators(Validators.min(1));
    this.form.controls['totalUse'].updateValueAndValidity();
  }

  updateMinMaxValidation() {
    this.form.controls['minPurchaseValue'].setValidators([
      Validators.max(this.form.controls['maxPurchaseValue'].value),
    ]);
    this.form.controls['minPurchaseValue'].updateValueAndValidity();

    this.form.controls['maxPurchaseValue'].setValidators([
      Validators.min(this.form.controls['minPurchaseValue'].value),
    ]);
    this.form.controls['maxPurchaseValue'].updateValueAndValidity();
  }

  /* increment and decrement input values */
  updateValue(controlKey: string, updateBy: string) {
    if (controlKey == 'minPurchaseValue' || controlKey == 'maxPurchaseValue')
      this.updateMinMaxValidation();

    if (updateBy == 'inc') {
      let incValue = isNaN(parseInt(this.form.get(controlKey)?.value))
        ? 0
        : parseInt(this.form.get(controlKey)?.value);
      this.form.get(controlKey)?.setValue(++incValue);
    } else if (updateBy == 'dec') {
      let decValue = isNaN(parseInt(this.form.get(controlKey)?.value))
        ? 1
        : parseInt(this.form.get(controlKey)?.value);
      if (--decValue > -1) {
        this.form.get(controlKey)?.setValue(decValue);
      }
    }
  }
}