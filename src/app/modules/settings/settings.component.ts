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
        this.reminderCurrentValue = result.usageReminder
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

  // Copy user email
  copyToClipboard(event: MouseEvent, email: string | undefined) {
    event.preventDefault();

    if(!email) {
      return;
    }
    
    navigator.clipboard.writeText(email);
  }
}
