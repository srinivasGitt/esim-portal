import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { DialogComponent } from '../../service/dialog';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {

  title: any = 'Title';
  header: any = 'Success';
  body: any = 'body'
  dialogRef: DialogComponent;
  constructor(private viewContainer: ViewContainerRef) {

    const _injector = this.viewContainer.injector;
    this.dialogRef = _injector.get<DialogComponent>(DialogComponent);
   }

  ngOnInit(): void {
    console.log(this.dialogRef)
  }

  close(): void {
    // this.data.amount = 343;
    this.dialogRef.close.emit();
  }

}
