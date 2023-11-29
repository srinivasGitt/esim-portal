import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DialogComponent } from 'src/app/shared/service/dialog';
import { StepperService } from '../../service/stepper.service';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

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
    // {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class AddCouponComponent implements OnInit {
  dialogRef: DialogComponent;
  currentDate = new Date().toISOString().slice(0, 10);
  currentStep: number = 0;
  stepCountArray: Array<number> = [1, 2, 3];
  list: Array<any> = [];

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
      totalUseType: new FormControl('')
    }),
    stepThree: new FormGroup({
      applicableType: new FormControl('plan'),
      applicableValue: new FormControl(null)
    })
  })

  constructor(private viewContainer: ViewContainerRef, private stepperService: StepperService) { 
    const _injector = this.viewContainer.injector;
    this.dialogRef = _injector.get<DialogComponent>(DialogComponent);

    this.couponForm.get('stepTwo.useType')?.valueChanges.subscribe((data: any) => {
      console.log(data)
      if(data == 'multi') 
      this.couponForm.get('stepTwo.totalUseType')?.setValue('limited');
    })
  }

  ngOnInit(): void {
    // Initialize the current step
    this.stepperService.currentStep$.subscribe((step) => {
      this.currentStep = step;
    });
  }
  
  submit() {
    console.log(this.couponForm.value);
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
