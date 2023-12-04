import { getCurrencySymbol } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

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

  constructor() { }

  ngOnInit(): void {
    this.currencyType = getCurrencySymbol(localStorage.getItem('currency')!, 'wide') ?? getCurrencySymbol('USD', 'wide');
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
    });
  }

  get f() { return this.loyaltyForm.controls; }

  submit() {
    this.submitted = true;
    console.log(this.loyaltyForm);
    console.log('submitted');

    if(this.loyaltyForm.value.unlimited) {
      this.loyaltyForm.value.voice = 0
    }

    console.log(this.loyaltyForm);
    if (this.loyaltyForm.invalid) {
      return;
    }
    console.log(this.loyaltyForm);
    this.createLoyaltyForm();
  }

  disableDiv() {
    this.show = !this.show;
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

     /* Restrict user to enter only numbers and decimal point */
  numberWithDecimalOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

}
