import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { DialogComponent } from '../../service/dialog';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {

  title: string = 'Something went wrong!';
  body: string = 'Oops, it seems like we have run into an error. Please rectify the problems and try again'
  dialogRef: DialogComponent;
  titleArr: string[] = ['Success', 'Error', 'Info', 'Warning']

  buttonGroup = [
    { cssClass: 'btn-secondary', title: 'Cancel', value: false},
    { cssClass: 'ms-auto', title: 'Try Again', value: false},
    { cssClass: 'ms-auto', title: 'Close', value: false},
    { cssClass: 'ms-auto', title: 'Redirect', value: false}
  ]

  constructor(private viewContainer: ViewContainerRef) {

    const _injector = this.viewContainer.injector;
    this.dialogRef = _injector.get<DialogComponent>(DialogComponent);
  }

  ngOnInit(): void {
    this.title = this.dialogRef.context.title;
    this.body = this.dialogRef.context.body;
    
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
        this.buttonGroup = this.buttonGroup.filter(x => x.title == 'Redirect')
        break;
      default:
        this.buttonGroup = this.buttonGroup.filter(x => x.title == 'Cancel' || x.title == 'Try Again')
    }

    if(this.titleArr.indexOf(this.dialogRef.context.title) == -1) {
      this.title = 'Something went wrong!'
      this.body = 'Oops, it seems like we have run into an error. Please rectify the problems and try again'
    }
    
    console.log(this.dialogRef)
  }

  close(): void {
    // this.data.amount = 343;
    this.dialogRef.close.emit();
  }

}
