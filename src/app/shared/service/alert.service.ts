import { Injectable } from '@angular/core';
import { AlertComponent } from '../dialog/alert/alert.component';
import { DialogService } from './dialog';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(private dialogService: DialogService) {}

  error(message: string | undefined, statusCode?: number) {
    let customTitle: string;

    if (statusCode && (statusCode == 401 || statusCode == 405)) {
      customTitle = 'Info';
    } else {
      customTitle = 'Error';
    }

    this.dialogService.openModal(AlertComponent, {
      cssClass: 'modal-sm',
      context: { title: customTitle, body: message, statusCode: statusCode },
    }).instance.close;
  }

  success(message: string | undefined, type?: string) {
    this.dialogService.openModal(AlertComponent, {
      cssClass: 'modal-sm',
      context: { title: 'Successful!', body: message, type: type },
    }).instance.close;
  }
}
