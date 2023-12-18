import { getCurrencySymbol } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
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

  constructor(private alertService: AlertService, private loyaltyService: LoyaltyService) { }

  ngOnInit(): void {
    this.currencyType = getCurrencySymbol(localStorage.getItem('currency')!, 'wide') ?? getCurrencySymbol('USD', 'wide');
    this.getLoyaltyData();
    
  }

  getLoyaltyData() {
    this.totalRewardPoints = 1500;
    this.totalUsedRewardPoints = 500;
    this.createLoyaltyForm();
  }

  createLoyaltyForm(): void {
    this.loyaltyForm = new UntypedFormGroup({
      rewardPoints: new UntypedFormControl(0, [Validators.required]),
      cashValue: new UntypedFormControl(0, [Validators.required]),
      purchaseValue: new UntypedFormControl(0, [Validators.required]),
      rewardPointsTwo: new UntypedFormControl(0, [Validators.required]),
      minimumRewardPoint: new UntypedFormControl(0),
      maximumRewardPoint: new UntypedFormControl(0),
      rewardPointsThree: new UntypedFormControl(0, [Validators.required])
    });
  }

  changeMode() {
    this.isDefault = !this.isDefault;
    if(this.isDefault) {
      this.loyaltyForm.enable() 
    } else {
      this.loyaltyForm.disable()
      
      //this.loyaltyForm.patchValue(this.externalEmailObj)
    }
  }

  get f() { 
    
    return this.loyaltyForm.controls; }

  submit() {
    this.submitted = true;

    if(this.loyaltyForm.value.unlimited) {
      this.loyaltyForm.value.voice = 0
    }

    if (this.loyaltyForm.invalid) {
      return;
    }

    const loyaltyData = {
      "payloadFlag":"rewardPoints",
      "rewardPointsValue": {
          "cashValue": this.loyaltyForm.controls.cashValue.value,
          "rewardPoints": this.loyaltyForm.controls.rewardPoints.value
      },
      "rewardPointsEarning": {
          "purchaseValue": this.loyaltyForm.controls.purchaseValue.value,
          "rewardPoints": this.loyaltyForm.controls.rewardPointsTwo.value
      },
      "rewardPointsMinRedeem": this.loyaltyForm.controls.minimumRewardPoint.value,
      "rewardPointsMaxRedeem": this.loyaltyForm.controls.maximumRewardPoint.value,
      "rewardPointsReferral": this.loyaltyForm.controls.rewardPointsThree.value
    }

    this.loyaltyService.loyaltyPoints(loyaltyData)
    .subscribe(
      (res: any) => {
        console.log(loyaltyData);
        console.log(res);
        this.alertService.success('You have successfully created a Loyalty Point Program.');
      }, err => {
        this.err = err.message;
        console.log(err.error.message);
        this.alertService.error(err.error.message);
      }
    );

    console.log(loyaltyData);
    // this.createLoyaltyForm();
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
    updateValue(controlKey: string, updateBy: string){
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

     /* Restrict user to enter only numbers and decimal point */
  numberWithDecimalOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

}

