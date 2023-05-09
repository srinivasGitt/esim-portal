import { Injectable } from '@angular/core';
import { AlertComponent } from '../dialog/alert/alert.component';
import { DialogService } from './dialog';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
    private dialogService : DialogService
  ) { }

  error(message: string, statusCode?: number){
    let customTitle: string;

    if(statusCode && statusCode == 401) {
      customTitle = 'Info'
    } else {
      customTitle = 'Error'
    }

    this.dialogService.openModal(AlertComponent, { cssClass: 'modal-sm', context: { title: customTitle, body: message} })
          .instance.close.subscribe((data: any) => {
        
        });
  }

  success(message: string){
    this.dialogService.openModal(AlertComponent, { cssClass: 'modal-sm', context: { title: 'Success', body: message} })
          .instance.close.subscribe((data: any) => {
        
        });
  }

}
