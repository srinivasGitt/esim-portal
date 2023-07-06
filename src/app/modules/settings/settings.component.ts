import { Component, OnInit } from '@angular/core';
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

  constructor(private settingsService: SettingsService, private alertService: AlertService) { }

  ngOnInit(): void {
    this.getSettings();
  }

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

  sendTestMail(value: string) {

    this.settingsService.testMail(value).subscribe((res: any) => {
      if(res) {
        this.alertService.success(res.message);
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
