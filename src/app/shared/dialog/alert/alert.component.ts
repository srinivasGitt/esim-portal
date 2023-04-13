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

  buttonGroup = [
    { cssClass: 'btn-secondary', title: 'Cancel', value: false},
    { cssClass: 'ms-auto', title: 'Try Again', value: false}
  ]

  constructor(private viewContainer: ViewContainerRef) {

    const _injector = this.viewContainer.injector;
    this.dialogRef = _injector.get<DialogComponent>(DialogComponent);
  }

  ngOnInit(): void {
    this.title = this.dialogRef.context.title;
    this.body = this.dialogRef.context.body;
    
    if(this.dialogRef.context.title !== 'Success' && this.dialogRef.context.title !== 'Error') {
      this.title = 'Something went wrong!'
    }
    
    if(this.dialogRef.context.title !== 'Success' && this.dialogRef.context.title !== 'Error') {
      this.body = 'Oops, it seems like we have run into an error. Please rectify the problems and try again'
    }
    console.log(this.dialogRef)
  }

  close(): void {
    // this.data.amount = 343;
    this.dialogRef.close.emit();
  }

}
