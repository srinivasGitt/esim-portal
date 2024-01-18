import { getCurrencySymbol } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ClientConfig } from 'src/app/shared/models/client-config.model';
import { AlertService } from 'src/app/shared/service';
import { ConfigurationService } from 'src/app/shared/service/configuration.service';
import { LocalStorageService } from 'src/app/shared/service/local-storage.service';
import { LoyaltyService } from 'src/app/shared/service/loyalty.service';
import { ILoyaltyPointsWidgetResponse } from './models/loyalty-points-widget-response.model';

@Component({
  selector: 'app-loyalty-point-program',
  templateUrl: './loyalty-point-program.component.html',
  styleUrls: ['./loyalty-point-program.component.scss'],
})
export class LoyaltyPointProgramComponent implements OnInit {
  loyaltyForm!: FormGroup; //loyaltyForm
  currencyType!: string;
  submitted: boolean = false;
  show = true;
  isDefault: boolean = false;
  isEdit: boolean = false;
  totalRewardPoints = 0;
  totalUsedRewardPoints = 0;
  err!: string;
  inProgress: boolean = false;
  clientConfig!: ClientConfig;
  cacheId!: string;

  constructor(
    private alertService: AlertService,
    private loyaltyService: LoyaltyService,
    private fb: FormBuilder,
    private localStorage: LocalStorageService,
    private configurationService: ConfigurationService
  ) {}

  ngOnInit(): void {
    this.currencyType =
      getCurrencySymbol(localStorage.getItem('currency')!, 'wide') ??
      getCurrencySymbol('USD', 'wide');

    // Client Configuration
    this.clientConfig = JSON.parse(this.localStorage.getCacheConfig()!);
    const id = this.clientConfig?.cacheId;
    this.cacheId = id!;

    if (this.clientConfig?.rewardPointsEnabled) {
      this.isDefault = true;
    } else {
      this.isDefault = false;
    }

    this.getConfiguration();
    // this.createLoyaltyForm(this.clientConfig);
    this.getLoyaltyWidgets();
  }

  getLoyaltyWidgets() {
    this.inProgress = true;
    this.loyaltyService.getLoyaltyWidgets().subscribe(
      (res: ILoyaltyPointsWidgetResponse) => {
        if (res && res.data && res.data.length > 0) {
          const data = res?.data[0];
          // Assuming data[0] is a JSON string, you might need to parse it
          const jsonData = JSON.parse(JSON.stringify(data));
          this.totalRewardPoints = jsonData.totalRewardPoints;
          this.totalUsedRewardPoints = jsonData.totalUsedRewardPoints;
          this.inProgress = false;
        }
      },
      (error) => {
        this.inProgress = false;
        this.err = error.message;
        this.alertService.error(error.error.message);
      }
    );
  }

  createLoyaltyForm(config?: ClientConfig): void {
    this.loyaltyForm = new FormGroup({
      rewardPointsValue: new FormGroup({
        cashValue: new FormControl(config?.rewardPointsValue?.cashValue ?? 0, [
          Validators.required,
          Validators.min(0),
        ]),
        rewardPoints: new FormControl(config?.rewardPointsValue?.rewardPoints ?? 0, [
          Validators.required,
          Validators.min(0),
        ]),
      }),
      rewardPointsEarning: new FormGroup({
        purchaseValue: new FormControl(config?.rewardPointsEarning?.purchaseValue ?? 0, [
          Validators.required,
          Validators.min(0),
        ]),
        rewardPoints: new FormControl(config?.rewardPointsEarning?.rewardPoints ?? 0, [
          Validators.required,
          Validators.min(0),
        ]),
      }),
      rewardPointsMinRedeem: new FormControl(config?.rewardPointsMinRedeem ?? 0),
      rewardPointsMaxRedeem: new FormControl(config?.rewardPointsMaxRedeem ?? 0),
      rewardPointsReferral: new FormControl(config?.rewardPointsReferral ?? 0, [
        Validators.required,
        Validators.min(0),
      ]),
    });

    this.isEdit ? this.loyaltyForm?.enable() : this.loyaltyForm?.disable();
  }

  changeMode() {
    this.isDefault = !this.isDefault;
    this.inProgress = true;
    this.loyaltyService
      .loyaltyPoints({ payloadFlag: 'featureFlags', rewardPointsEnabled: this.isDefault })
      .subscribe(
        (res: ClientConfig) => {
          const message = res?.message || '';
          this.alertService.success(message);
          this.getConfiguration();
          this.isEdit = false;
          this.inProgress = false;
          this.isEdit ? this.loyaltyForm?.enable() : this.loyaltyForm?.disable();
        },
        (err) => {
          this.err = err.message;
          this.alertService.error(err.error.message);
          this.isEdit = false;
          this.inProgress = false;
          this.isDefault ? (this.isDefault = false) : (this.isDefault = true);
        }
      );
  }

  submit() {
    this.submitted = true;
    this.inProgress = true;

    if (this.loyaltyForm.invalid) {
      return;
    }

    if (!this.loyaltyForm.get('rewardPointsMinRedeem')?.value) {
      this.loyaltyForm.controls['rewardPointsMinRedeem'].setValue(0);
    }

    if (!this.loyaltyForm.get('rewardPointsMaxRedeem')?.value) {
      this.loyaltyForm.controls['rewardPointsMaxRedeem'].setValue(0);
    }

    this.loyaltyService
      .loyaltyPoints({ payloadFlag: 'rewardPoints', ...this.loyaltyForm.value })
      .subscribe(
        (res: ClientConfig) => {
          const message = res?.message || '';
          this.alertService.success(message);
          this.getConfiguration();
          this.clientConfig = JSON.parse(this.localStorage.getCacheConfig()!);
          this.submitted = false;
          this.isEdit = false;
          this.inProgress = false;
        },
        (err) => {
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
  updateValue(groupName: string, controlKey: string, updateBy: string) {
    if (groupName) {
      if (updateBy == 'inc') {
        let incValue = isNaN(parseInt(this.loyaltyForm.controls[groupName].get(controlKey)?.value))
          ? 0
          : parseInt(this.loyaltyForm.controls[groupName].get(controlKey)?.value);
        this.loyaltyForm.controls[groupName].get(controlKey)?.setValue(++incValue);
      } else if (updateBy == 'dec') {
        let decValue = isNaN(parseInt(this.loyaltyForm.controls[groupName].get(controlKey)?.value))
          ? 1
          : parseInt(this.loyaltyForm.controls[groupName].get(controlKey)?.value);
        if (--decValue > -1) {
          this.loyaltyForm.controls[groupName].get(controlKey)?.setValue(decValue);
        }
      }
    } else {
      if (updateBy == 'inc') {
        let incValue = isNaN(parseInt(this.loyaltyForm.controls[controlKey].value))
          ? 0
          : parseInt(this.loyaltyForm.controls[controlKey].value);
        this.loyaltyForm.controls[controlKey].setValue(++incValue);
      } else if (updateBy == 'dec') {
        let decValue = isNaN(parseInt(this.loyaltyForm.controls[controlKey].value))
          ? 1
          : parseInt(this.loyaltyForm.controls[controlKey].value);
        if (--decValue > -1) {
          this.loyaltyForm.controls[controlKey].setValue(decValue);
        }
      }
    }
  }

  /* Restrict user to enter only numbers and decimal point */
  numberWithDecimalOnly(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  updateValidation() {
    const rewardPointsMin = this.loyaltyForm.controls['rewardPointsMinRedeem'].value;
    const rewardPointsMax = this.loyaltyForm.controls['rewardPointsMaxRedeem'].value;

    if (rewardPointsMin || rewardPointsMax) {
      this.loyaltyForm.controls['rewardPointsMinRedeem'].setValidators([
        Validators.required,
        Validators.max(this.loyaltyForm.controls['rewardPointsMinRedeem'].value),
      ]);
      this.loyaltyForm.controls['rewardPointsMinRedeem'].updateValueAndValidity();
      this.loyaltyForm.controls['rewardPointsMaxRedeem'].setValidators([
        Validators.required,
        Validators.min(this.loyaltyForm.controls['rewardPointsMinRedeem'].value),
      ]);
      this.loyaltyForm.controls['rewardPointsMaxRedeem'].updateValueAndValidity();
    } else {
      this.loyaltyForm.controls['rewardPointsMinRedeem'].clearValidators();
      this.loyaltyForm.controls['rewardPointsMaxRedeem'].clearValidators();
      this.loyaltyForm.controls['rewardPointsMaxRedeem'].updateValueAndValidity();
      this.loyaltyForm.controls['rewardPointsMinRedeem'].updateValueAndValidity();

      this.loyaltyForm.controls['rewardPointsMinRedeem'].setValidators([
        Validators.max(this.loyaltyForm.controls['rewardPointsMinRedeem'].value),
      ]);
      this.loyaltyForm.controls['rewardPointsMinRedeem'].updateValueAndValidity();

      this.loyaltyForm.controls['rewardPointsMaxRedeem'].setValidators([
        Validators.min(this.loyaltyForm.controls['rewardPointsMinRedeem'].value),
      ]);
      this.loyaltyForm.controls['rewardPointsMaxRedeem'].updateValueAndValidity();
    }

    console.log(this.loyaltyForm);
  }

  getConfiguration() {
    this.inProgress = true;
    const clientConfig = JSON.parse(localStorage.getItem('config')!);

    this.configurationService.getConfigurationSetting(clientConfig?.cacheId).subscribe(
      (res: any) => {
        if (res) {
          const data = res.data;
          this.localStorage.setCacheConfig(JSON.stringify(data));
          this.clientConfig = JSON.parse(this.localStorage.getCacheConfig()!);

          this.createLoyaltyForm(this.clientConfig);
          this.inProgress = false;
        }
      },
      (err) => {
        this.alertService.error(err.error.message, err.status);
        this.inProgress = false;
      }
    );
  }
}
