import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/shared/service';
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
  
  constructor(private settingsService: SettingsService, private alertService: AlertService) { 
    this.initForm()
  }

  ngOnInit(): void {
    this.getSettings();
    this.getSMTPSettings();
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

    this.emailSetupForm.disable()
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
        this.inProgress = false;
        this.isSubmitted = false;
      }
    }, err => {
      this.alertService.error(err.error.message, err.status);
      this.inProgress = false;
      this.isSubmitted = false;
    })
  }

  getSettings() {
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


  getSMTPSettings() {
    this.inProgress = true;
    this.settingsService.getSMTP().subscribe((res: any) => { 
      if(res) {
        this.externalEmailObj = res.data
        this.emailSetupForm.patchValue(this.externalEmailObj)
      }
    }, err => {
      this.alertService.error(err.error.message, err.status);
      this.inProgress = false;
    })
  }

  sendTestMail(value: string) {
    this.isSubmitted = true
    this.inProgress = true

    this.settingsService.testMail(value).subscribe((res: any) => {
      if(res) {
        this.alertService.success(res.message);
        this.inProgress = false;
        this.isSubmitted = false;
      }
    }, err => {
      this.alertService.error(err.error.message, err.status);
    })
  }

  editField(str: string) {
    if(str === 'support') this.isSupportEdit = true;
    if(str === 'contact') this.isContactEdit = true;
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

  // Copy user email
  copyToClipboard(event: MouseEvent, email: string | undefined) {
    event.preventDefault();

    if(!email) {
      return;
    }
    
    navigator.clipboard.writeText(email);
  }
}
