import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { DialogComponent } from '../../service/dialog';

@Component({
  selector: 'app-qr-code-popup',
  templateUrl: './qr-code-popup.component.html',
  styleUrls: ['./qr-code-popup.component.scss']
})
export class QrCodePopupComponent implements OnInit {
  dialogRef: DialogComponent;
  data: any;
  subscriptionForm: any;
  title: string = 'Add Subscription';
  constructor(
    private viewContainer: ViewContainerRef) {
    const _injector = this.viewContainer.injector;
    this.dialogRef = _injector.get<DialogComponent>(DialogComponent);
  }
  
  
  ngOnInit(): void {
    this.data = this.dialogRef.context.data;
    console.log(this.data);
    this.title = this.dialogRef.context.title;
  }
  close(): void {
    this.dialogRef.close.emit(false);
  }
}
