import { getCurrencySymbol } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/shared/service';
import { LocalStorageService } from 'src/app/shared/service/local-storage.service';
import { LoyaltyService } from 'src/app/shared/service/loyalty.service';

@Component({
  selector: 'app-loyalty-point-program',
  templateUrl: './loyalty-point-program.component.html',
  styleUrls: ['./loyalty-point-program.component.scss']
})
export class LoyaltyPointProgramComponent implements OnInit {
  loyaltyForm!: FormGroup; //loyaltyForm
  currencyType: any;
  submitted: boolean = false;
  show = true;
  isDefault: boolean = false;
  isEdit: boolean = false;
  totalRewardPoints = 0;
  totalUsedRewardPoints = 0;
  err : any;
  inProgress: boolean = false;
  clientConfig: any;
  cacheId: any;

  constructor(private alertService: AlertService, 
    private loyaltyService: LoyaltyService,
    private fb: FormBuilder,
    private localStorage: LocalStorageService) { }

  ngOnInit(): void {
    this.currencyType = getCurrencySymbol(localStorage.getItem('currency')!, 'wide') ?? getCurrencySymbol('USD', 'wide');
    
    // Client Configuration
    this.clientConfig = JSON.parse(this.localStorage.getCacheConfig()!);
    this.cacheId = this.clientConfig?.cacheId;
    if(this.clientConfig?.rewardPointsMasterEnabled && this.clientConfig.rewardPointsEnabled) {
      this.loyaltyForm?.enable();
    } else {
      this.loyaltyForm?.disable();
    }
    this.createLoyaltyForm(this.clientConfig);
    this.getLoyaltyWidgets();
  }

  getLoyaltyWidgets(){
    this.inProgress = true;
    this.loyaltyService.getLoyaltyWidgets().subscribe((res: any) => {
        if(res && res.data) {
          this.totalRewardPoints = res?.data[0]?.totalRewardPoints;
          this.totalUsedRewardPoints = res?.data[0]?.totalUsedRewardPoints;   
          this.inProgress = false;
        }
      }, error => {
        this.inProgress = false;
        this.err = error.message;
        this.alertService.error(error.error.message);
      }
    );
  }

  createLoyaltyForm(config?: any): void {
    // this.loyaltyForm = this.fb.group({
    //   rewardPointsValue: this.fb.group({
    //     cashValue: [config?.rewardPointsValue?.cashValue ?? 0, [Validators.required, Validators.min(1)]],
    //     rewardPoints: [config?.rewardPointsValue?.rewardPoints ?? 0, [Validators.required, Validators.min(1)]]
    //   }),
    //   rewardPointsEarning: this.fb.group({
    //       purchaseValue: [config?.rewardPointsEarning?.purchaseValue ?? 0, [Validators.required, Validators.min(1)]],
    //       rewardPoints: [config?.rewardPointsEarning?.rewardPoints ?? 0, [Validators.required, Validators.min(1)]]
    //   }),
    //   rewardPointsMinRedeem: [config?.rewardPointsMinRedeem ?? 0],
    //   rewardPointsMaxRedeem: [config?['rewardPointsMinRedeem'] ?? 0],
    //   rewardPointsReferral: [config?.rewardPointsReferral ?? 0, [Validators.required, Validators.min(1)]]
    // });

    this.loyaltyForm = new FormGroup({
        rewardPointsValue: new FormGroup({
          cashValue: new FormControl(config?.rewardPointsValue?.cashValue ?? 0, [Validators.required, Validators.min(1)]),
          rewardPoints: new FormControl(config?.rewardPointsValue?.rewardPoints ?? 0, [Validators.required, Validators.min(1)])
        }),
        rewardPointsEarning: new FormGroup({
            purchaseValue: new FormControl(config?.rewardPointsEarning?.purchaseValue ?? 0, [Validators.required, Validators.min(1)]),
            rewardPoints: new FormControl(config?.rewardPointsEarning?.rewardPoints ?? 0, [Validators.required, Validators.min(1)])
        }),
        rewardPointsMinRedeem: new FormControl(config?.rewardPointsMinRedeem ?? 0),
        rewardPointsMaxRedeem: new FormControl(config?.rewardPointsMaxRedeem ?? 0),
        rewardPointsReferral: new FormControl(config?.rewardPointsReferral ?? 0, [Validators.required, Validators.min(1)])
      });
    // this.loyaltyForm.controls['rewardPointsMinRedeem'].setValidators([Validators.max(this.loyaltyForm.controls['rewardPointsMinRedeem'].value)]);
    // this.loyaltyForm.controls['rewardPointsMinRedeem'].updateValueAndValidity();

    // this.loyaltyForm.controls['rewardPointsMaxRedeem'].setValidators([Validators.min(this.loyaltyForm.controls['rewardPointsMinRedeem'].value)]);
    // this.loyaltyForm.controls['rewardPointsMaxRedeem'].updateValueAndValidity();
  }

  changeMode() {
    this.isDefault = !this.isDefault;
    if(this.isDefault) {
      this.loyaltyForm.enable();
    } else {
      this.loyaltyForm.disable();
    }
  }

  submit() {
    this.submitted = true;
    this.inProgress = true;

    if (this.loyaltyForm.invalid) {
      return;
    }
    
    this.loyaltyService.loyaltyPoints({payloadFlag: "rewardPoints", ...this.loyaltyForm.value}).subscribe(
      (res: any) => {
        this.alertService.success(res.message);
        this.submitted = false;
        this.isEdit = false;
        this.inProgress = false;
      }, err => {
        this.err = err.message;
        this.alertService.error(err.error.message);
        this.submitted = false;
        this.isEdit = false;
        this.inProgress = false;
      }
    );
  }

  reset() {
    this.isEdit = false;
    this.loyaltyForm.reset();
    this.createLoyaltyForm(this.clientConfig);
  }

  // edit() {
  //   if(this.isDefault) {
  //     this.loyaltyForm.enable() 
  //   } else {
  //     this.loyaltyForm.disable()
  //   }
  // }

  // disableDiv() {
  //   this.show = !this.show;
  // }

  /* increment and decrement input values */
  updateValue(groupName:string, controlKey: string, updateBy: string){

    if(groupName) {
      if(updateBy == 'inc'){
        let incValue = isNaN(parseInt(this.loyaltyForm.controls[groupName].get(controlKey)?.value)) ? 0 : parseInt(this.loyaltyForm.controls[groupName].get(controlKey)?.value);
        this.loyaltyForm.controls[groupName].get(controlKey)?.setValue(++incValue);
      } else if(updateBy == 'dec'){
        let decValue = isNaN(parseInt(this.loyaltyForm.controls[groupName].get(controlKey)?.value)) ? 1 : parseInt(this.loyaltyForm.controls[groupName].get(controlKey)?.value);
        if(--decValue > -1){
          this.loyaltyForm.controls[groupName].get(controlKey)?.setValue(decValue);
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
    this.loyaltyForm.controls['rewardPointsMinRedeem'].setValidators([Validators.max(this.loyaltyForm.controls['rewardPointsMinRedeem'].value)]);
    this.loyaltyForm.controls['rewardPointsMinRedeem'].updateValueAndValidity();

    this.loyaltyForm.controls['rewardPointsMaxRedeem'].setValidators([Validators.min(this.loyaltyForm.controls['rewardPointsMinRedeem'].value)]);
    this.loyaltyForm.controls['rewardPointsMaxRedeem'].updateValueAndValidity();
  }

}

