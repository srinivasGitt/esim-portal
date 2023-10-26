import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { DialogComponent, DialogService } from '../../service/dialog';
import { UploadInventoryComponent } from '../upload-inventory/upload-inventory.component';

@Component({
  selector: 'app-report-alert',
  templateUrl: './report-alert.component.html',
  styleUrls: ['./report-alert.component.scss']
})
export class ReportAlertComponent implements OnInit {

  title: string = 'Something went wrong!';
  body: string = 'Oops, it seems like we have run into an error. Please rectify the problems and try again'
  dialogRef: DialogComponent;
  titleArr: string[] = ['Successful!', 'Error', 'Info', 'Warning']
  type!: string
  buttonGroup = [
    { cssClass: 'btn-secondary', title: 'Back', value: false},
    { cssClass: 'ms-auto', title: 'Try Again', value: false},
    { cssClass: 'ms-auto', title: 'Close', value: false},
    { cssClass: 'ms-auto', title: 'Continue', value: false},
    { cssClass: 'ms-auto', title: 'Upload Another', value: false}
  ]

  constructor(private viewContainer: ViewContainerRef, private dialogService: DialogService) {

    const _injector = this.viewContainer.injector;
    this.dialogRef = _injector.get<DialogComponent>(DialogComponent);
  }

  ngOnInit(): void {
    this.title = this.dialogRef.context.title;
    this.body = this.dialogRef.context.body;
    this.type = this.dialogRef.context.type
    /*
    // this.buttonGroup = this.title == 'Succes' ? this.buttonGroup.filter(x => x.title == 'Cancel' || x.title == 'Continue') 
    //                   : (this.title == 'Info' ? this.buttonGroup.filter(x => x.title == 'Cancel' || x.title == 'Login') : this.buttonGroup)

    switch (this.title) {
      case 'Success':
        // this.buttonGroup = this.buttonGroup.filter(x => x.title == 'Cancel' || x.title == 'Continue')
        this.buttonGroup = this.buttonGroup.filter(x => x.title == 'Close')
        break;
      case 'Error':
        this.buttonGroup = this.buttonGroup.filter(x => x.title == 'Cancel' || x.title == 'Try Again')
        break;
      case 'Info':
        // this.buttonGroup = this.buttonGroup.filter(x => x.title == 'Cancel' || x.title == 'Login')
        this.buttonGroup = this.buttonGroup.filter(x => x.title == 'Close')
        break;
      default:
        this.title = 'Something went wrong!'
        this.body = 'Oops, it seems like we have run into an error. Please rectify the problems and try again'
        this.buttonGroup = this.buttonGroup.filter(x => x.title == 'Cancel' || x.title == 'Try Again')
    }
  
    // if(this.titleArr.indexOf(this.dialogRef.context.title) == -1) {
    //   this.title = 'Something went wrong!'
    //   this.body = 'Oops, it seems like we have run into an error. Please rectify the problems and try again'
    // }
    */
    switch (true) {
      case this.title == 'Error':
        this.buttonGroup = this.buttonGroup.filter(x => x.title == 'Back' || x.title == 'Try Again')
        break;
      case this.title == 'Successful!' && this.type == 'Inventory':
        this.buttonGroup = this.buttonGroup.filter(x => x.title == 'Continue' || x.title == 'Upload Another')
        break;
    }
  }

  close(openUploadInvenotry?: any): void {
    // this.data.amount = 343;
    this.dialogRef.close.emit();

    if(openUploadInvenotry) {
      this.dialogService.openModal(UploadInventoryComponent, { cssClass: 'modal-sm', context: {data: {}, title: 'Upload Inventory'} })
      .instance.close.subscribe((data: any) => {
        
      });
    }
  }

}
