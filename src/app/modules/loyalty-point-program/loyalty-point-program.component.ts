import { getCurrencySymbol } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/shared/service';
import { LoyaltyService } from 'src/app/shared/service/loyalty.service';

@Component({
  selector: 'app-loyalty-point-program',
  templateUrl: './loyalty-point-program.component.html',
  styleUrls: ['./loyalty-point-program.component.scss']
})
export class LoyaltyPointProgramComponent implements OnInit {
  loyaltyForm: any; //loyaltyForm
  currencyType: any;
  submitted = false;
  show = true;
  isDefault = true;
  isEdit = false;
  totalRewardPoints = 0;
  totalUsedRewardPoints = 0;
  err : any;

  constructor(private alertService: AlertService, 
    private loyaltyService: LoyaltyService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.currencyType = getCurrencySymbol(localStorage.getItem('currency')!, 'wide') ?? getCurrencySymbol('USD', 'wide');
    this.getLoyaltyPoints();
    this.getLoyaltyWidgets();
  }

  getLoyaltyPoints(){
    this.loyaltyService.getLoyaltyPoints()
    .subscribe(
      (res: any) => {
        this.createLoyaltyForm(res);
      }, err => {
        this.err = err.message;
      }
    );
  }

  getLoyaltyWidgets(){
    this.loyaltyService.getLoyaltyWidgets()
    .subscribe(
      (res: any) => {
        this.totalRewardPoints = res.data[0].totalRewardPoints;
        this.totalUsedRewardPoints = res.data[0].totalUsedRewardPoints;
   

      }, err => {
        this.err = err.message;
      }
    );
  }

  createLoyaltyForm(res: any): void {
    this.loyaltyForm = this.fb.group({
      rewardPointsValue: this.fb.group({
        cashValue: [res.data.rewardPointsValue.cashValue ? res.data.rewardPointsValue.cashValue : 0, [Validators.required, Validators.min(1)]],
        rewardPoints: [res.data.rewardPointsValue.rewardPoints ? res.data.rewardPointsValue.rewardPoints : 0, [Validators.required, Validators.min(1)]]
      }),
      rewardPointsEarning: this.fb.group({
          purchaseValue: [res.data.rewardPointsEarning.purchaseValue ? res.data.rewardPointsEarning.purchaseValue : 0, [Validators.required, Validators.min(1)]],
          rewardPoints: [res.data.rewardPointsEarning.rewardPoints ? res.data.rewardPointsEarning.rewardPoints : 0, [Validators.required, Validators.min(1)]]
      }),
      rewardPointsMinRedeem: [res.data.rewardPointsMinRedeem ? res.data.rewardPointsMinRedeem : 0],
      rewardPointsMaxRedeem: [res.data.rewardPointsMaxRedeem ? res.data.rewardPointsMaxRedeem : 0],
      rewardPointsReferral: [res.data.rewardPointsReferral ? res.data.rewardPointsReferral : 0, [Validators.required, Validators.min(1)]]
    });

    this.loyaltyForm.controls['rewardPointsMinRedeem'].setValidators([Validators.max(this.loyaltyForm.controls.rewardPointsMaxRedeem.value)]);
    this.loyaltyForm.controls['rewardPointsMinRedeem'].updateValueAndValidity();

    this.loyaltyForm.controls['rewardPointsMaxRedeem'].setValidators([Validators.min(this.loyaltyForm.controls.rewardPointsMinRedeem.value)]);
    this.loyaltyForm.controls['rewardPointsMaxRedeem'].updateValueAndValidity()

  }

  changeMode() {
    this.isDefault = !this.isDefault;
    if(this.isDefault) {
      this.loyaltyForm.enable() 
    } else {
      this.loyaltyForm.disable()
    }
  }

  submit() {
    this.submitted = true;

    if (this.loyaltyForm.invalid) {
      return;
    }

    this.loyaltyService.loyaltyPoints({payloadFlag: "rewardPoints", ...this.loyaltyForm.value})
    .subscribe(
      (res: any) => {
        this.alertService.success(res.message);
      }, err => {
        this.err = err.message;
        this.alertService.error(err.error.message);
      }
    );
  }

  edit() {
    if(this.isDefault) {
      this.loyaltyForm.enable() 
    } else {
      this.loyaltyForm.disable()
      //this.loyaltyForm.patchValue(this.externalEmailObj)
    }
  }

  disableDiv() {
    this.show = !this.show;
  }

  /* increment and decrement input values */
  updateValue(groupName:string, controlKey: string, updateBy: string){

    if(groupName) {
      if(updateBy == 'inc'){
        let incValue = isNaN(parseInt(this.loyaltyForm.get(groupName).get(controlKey).value)) ? 0 : parseInt(this.loyaltyForm.get(groupName).get(controlKey).value);
        this.loyaltyForm.get(groupName).get(controlKey).setValue(++incValue);
      } else if(updateBy == 'dec'){
        let decValue = isNaN(parseInt(this.loyaltyForm.get(groupName).get(controlKey).value)) ? 1 : parseInt(this.loyaltyForm.get(groupName).get(controlKey).value);
        if(--decValue > -1){
          this.loyaltyForm.get(groupName).get(controlKey).setValue(decValue);
        }
      }
    } else {
      if(updateBy == 'inc'){
        let incValue = isNaN(parseInt(this.loyaltyForm.controls[controlKey].value)) ? 0 : parseInt(this.loyaltyForm.controls[controlKey].value);
        this.loyaltyForm.controls[controlKey].setValue(++incValue);
      } else if(updateBy == 'dec'){
        let decValue = isNaN(parseInt(this.loyaltyForm.controls[controlKey].value)) ? 1 : parseInt(this.loyaltyForm.controls[controlKey].value);
        if(--decValue > -1){
          this.loyaltyForm.controls[controlKey].setValue(decValue);
        }
      }
    }
    
  }

  /* Restrict user to enter only numbers and decimal point */
  numberWithDecimalOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }


  updateValidation() {
    this.loyaltyForm.controls['rewardPointsMinRedeem'].setValidators([Validators.max(this.loyaltyForm.controls.rewardPointsMaxRedeem.value)]);
    this.loyaltyForm.controls['rewardPointsMinRedeem'].updateValueAndValidity();

    this.loyaltyForm.controls['rewardPointsMaxRedeem'].setValidators([Validators.min(this.loyaltyForm.controls.rewardPointsMinRedeem.value)]);
    this.loyaltyForm.controls['rewardPointsMaxRedeem'].updateValueAndValidity();
  }

}

