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

  error(message: string){
    this.dialogService.openModal(AlertComponent, { cssClass: 'modal-md', context: { title: 'Error', body: message} })
          .instance.close.subscribe((data: any) => {
        
        });
  }

  success(message: string){
    this.dialogService.openModal(AlertComponent, { cssClass: 'modal-md', context: { title: 'Success', body: message} })
          .instance.close.subscribe((data: any) => {
        
        });
  }
}
