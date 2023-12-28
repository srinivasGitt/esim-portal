import { getCurrencySymbol } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ClientConfig } from 'src/app/shared/models/client-config.model';
import { AlertService } from 'src/app/shared/service';
import { LocalStorageService } from 'src/app/shared/service/local-storage.service';
import { SettingsService } from 'src/app/shared/service/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  reminderValues: number[] = [0,60,70,80,90];
  supportEmail: string | undefined = undefined;
  contactEmail: string | undefined = undefined;
  copyText: string = 'Copy'
  reminderCurrentValue: number | undefined = undefined;
  inProgress: boolean = false;
  isSubmitted: boolean = false;
  isEdit: boolean = false;
  currenctSupportEmail: string | undefined = undefined;
  currenctContactEmail: string | undefined = undefined;
  isContactEdit: boolean = false;
  isSupportEdit: boolean = false;
  currentUsageValue: number | undefined;
  isCustom: boolean = false;
  emailSetupForm: any;
  externalEmailObj: any;
  currencyList!: Array<any>;
  currencySetupForm!: FormGroup;
  defaultCurrencyList: any;
  currencySetupFormObj: any;
  isCurrencyEdit: boolean = false;
  clientConfig!: any;
  cacheId!: string;

  constructor(private settingsService: SettingsService,
              private alertService: AlertService,
              private localStorage: LocalStorageService) {
    this.initForm();
  }

  ngOnInit(): void {
    this.inProgress = true;

    // Client Configuration
    this.clientConfig = JSON.parse(this.localStorage.getCacheConfig()!);
    this.cacheId = this.clientConfig?.cacheId;
    if(!this.clientConfig?.currencyConversionMasterEnabled) this.currencySetupForm.disable();

    forkJoin(this.settingsService.getAllSettings(this.cacheId)).subscribe((response: any) => {
      if(response) {
        // Inventory Response
        this.getSettings(response[0]?.data);

        // Email Forwarding Response
        this.getSMTPSettings(response[1]?.data);

        // Currency Response
        this.getCurrencySettings(response[2]?.data, response[3]?.data);

      }
      this.inProgress = false;
    }, err => {
      this.alertService.error(err.error.message, err.status);
      this.inProgress = false;
    })
  }

  initForm(data?: any) {
    this.emailSetupForm = new UntypedFormGroup({
      outgoingServer: new UntypedFormControl('', [Validators.required]),
      port: new UntypedFormControl('', [Validators.required]),
      username: new UntypedFormControl('', [Validators.required]),
      password: new UntypedFormControl('', [Validators.required]),
      secure: new UntypedFormControl('', [Validators.required]),
      alias: new UntypedFormControl('')
    });

    this.currencySetupForm = new FormGroup({
      currencyList: new FormControl('', [Validators.required]),
      defaultCurrency: new FormControl(null, [Validators.required])
    });

    this.currencySetupForm.disable();
    this.emailSetupForm.disable();
  }

  get f() { return this.emailSetupForm.controls; }

  save() {
    this.isSubmitted = true
    this.inProgress = true
    let settingsObj = { supportUsEmail: this.supportEmail, contactUsEmail: this.contactEmail, usageReminder: this.reminderCurrentValue}
    this.settingsService.saveSettings(settingsObj).subscribe((res: any) => {
      if(res) {
        this.alertService.success(res.message);
        this.getSettings();
        this.inProgress = this.isSubmitted = this.isSupportEdit = this.isContactEdit = false;
      }
    }, err => {
      this.alertService.error(err.error.message, err.status);
      this.inProgress = false;
      this.isSubmitted = false;
    })
  }

  getSettings(response? : any) {
    if(response) {
      this.contactEmail = response.contactUsEmail
      this.supportEmail = response.supportUsEmail
      this.reminderCurrentValue = response.usageReminder
      this.currenctSupportEmail = this.supportEmail
      this.currenctContactEmail = this.contactEmail
      this.currentUsageValue = this.reminderCurrentValue
    }
    else {
      this.inProgress = true;
      this.settingsService.getSettings().subscribe((res: any) => {
        if(res) {
          let result = res.data
          this.contactEmail = result.contactUsEmail
          this.supportEmail = result.supportUsEmail
          this.currenctSupportEmail = this.supportEmail
          this.currenctContactEmail = this.contactEmail
          this.reminderCurrentValue = result.usageReminder
          this.currentUsageValue = this.reminderCurrentValue
          this.inProgress = false;
        }
      }, err => {
        this.alertService.error(err.error.message, err.status);
        this.inProgress = false;
      })
    }
  }


  getSMTPSettings(response? : any) {
    if(response) {
      this.emailSetupForm.patchValue(response)
    }
    else {
      this.inProgress = true;
      this.settingsService.getSMTP().subscribe((res: any) => {
        if(res) {
          this.externalEmailObj = res.data
          this.emailSetupForm.patchValue(this.externalEmailObj)
          this.inProgress = false;
        }
      }, err => {
        this.alertService.error(err.error.message, err.status);
        this.inProgress = false;
      })
    }
  }

  getCurrencySettings(response1? : any, response2?: any) {
    if(response1 && response2) {
      this.currencySetupForm.patchValue({
        currencyList: response1.currencyList,
        defaultCurrency: Object.keys(response1.defaultCurrency).length == 0 ? null : response1.defaultCurrency
      });
      this.currencySetupFormObj = response1
      this.defaultCurrencyList = response1?.currencyList
      this.currencyList = response2;
    }
    else {
      this.inProgress = true;
      this.settingsService.getCurrencySettings().subscribe((res: any) => {
        if(res) {
          this.currencySetupForm.patchValue({
            currencyList: res.data?.currencyList,
            defaultCurrency: Object.keys(res.data?.defaultCurrency).length == 0 ? null : res.data?.defaultCurrency,
          })
          this.inProgress = false;
        }
      }, err => {
        this.inProgress = false;
        this.alertService.error(err.error.message, err.status);
      })
    }
  }

  sendTestMail(value: string) {
    this.isSubmitted = true;
    this.inProgress = true;

    this.settingsService.testMail(value).subscribe((res: any) => {
      if(res) {
        this.alertService.success(res.message);
        this.inProgress = false;
        this.isSubmitted = false;
      }
    }, err => {
      this.inProgress = false;
      this.alertService.error(err.error.message, err.status);
    })
  }

  editField(str: string) {
    if(str === 'support') this.isSupportEdit = true;
    if(str === 'contact') this.isContactEdit = true;
    if(str === 'currency') {
      this.isCurrencyEdit = true;
      this.currencySetupForm.enable();
    }
  }

  cancel(str: string) {
    switch (str) {
      case 'email':
        this.supportEmail = this.currenctSupportEmail
        this.contactEmail = this.currenctContactEmail
        this.isSupportEdit = this.isContactEdit = false;
        break;
      case 'usage':
        this.reminderCurrentValue = this.currentUsageValue
        break;
      case 'smtp':
        this.isCustom = false
        this.emailSetupForm.patchValue(this.externalEmailObj)
        this.emailSetupForm.disable()
        break;
      case 'currency':
        this.isCurrencyEdit = false;
        this.currencySetupForm.disable();
        this.currencySetupForm.patchValue(this.currencySetupFormObj)
        break;
    }

  }

  edit() {
    if(this.isCustom) {
      this.emailSetupForm.enable()
    } else {
      this.emailSetupForm.disable()
      this.emailSetupForm.patchValue(this.externalEmailObj)
    }
  }

  saveEmailSetup() {
    this.isSubmitted = true
    this.inProgress = true

    if (this.emailSetupForm.invalid) {
      return;
    }

    const smtp = this.emailSetupForm.value
    smtp.port = parseInt(this.emailSetupForm.value.port)
    this.settingsService.saveSMTP(this.emailSetupForm.value).subscribe((res: any) => {
      if(res) {
        this.alertService.success(res.message);
        this.inProgress = false;
        this.isSubmitted = false;
        this.getCurrencySettings();
      }
    }, err => {
      this.alertService.error(err.error.message, err.status);
      this.inProgress = false;
      this.isSubmitted = false;
    })
  }

  sendTestSMTPEMail() {
    this.isSubmitted = true
    this.inProgress = true

    if (this.emailSetupForm.invalid) {
      return;
    }
    this.settingsService.testSMTP(this.emailSetupForm.value).subscribe((res: any) => {
      if(res) {
        this.alertService.success(res.message);
        this.inProgress = false;
        this.isSubmitted = false;
      }
    }, err => {
      this.alertService.error(err.error.message, err.status);
    })
  }

  // Currencies Selection
  onCurrenciesChange(event: any) {
    this.defaultCurrencyList = event;
  }

  // Currency Selection
  onCurrencyChange(event: any) {

  }

  // Save Currency Settings
  saveCurrencySetup() {
    this.isSubmitted = true
    this.inProgress = true

    if (this.currencySetupForm.invalid) {
      return;
    }

    this.settingsService.saveCurrencySetup(this.currencySetupForm.value).subscribe((res: any) => {
      if(res) {
        this.alertService.success(res.message);
        this.inProgress = false;
        this.isSubmitted = false;
        this.isCurrencyEdit = false;
        this.currencySetupForm.disable();
      }
    }, err => {
      this.inProgress = false;
      this.isSubmitted = false;
      this.alertService.error(err.error.message, err.status);
    })
  }

  displaySelectedCurrencies(currencies: any){
    return currencies.map((currency: any) => currency.currency_name).slice(2).join(', ');
  }

  onCurrencyRemoveFromList(event: any) {
    const defaultCurrency = this.currencySetupForm.get('defaultCurrency');
    if(event && defaultCurrency && defaultCurrency != null && event.label == defaultCurrency?.value?.currency_name) {
      this.currencySetupForm.controls['defaultCurrency'].setValue(null);
    }
  }

  onCurrenciesListClear(event: any) {
    if(!event) {
      this.currencySetupForm.controls['defaultCurrency'].setValue(null);
    }
  }

  // Copy user email
  copyToClipboard(event: MouseEvent, email: string | undefined) {
    event.preventDefault();

    if(!email) {
      return;
    }

    navigator.clipboard.writeText(email);
  }
}
