import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { DialogComponent } from '../../service/dialog';

@Component({
  selector: 'app-subscription-info',
  templateUrl: './subscription-info.component.html',
  styleUrls: ['./subscription-info.component.scss']
})
export class SubscriptionInfoComponent implements OnInit {

  dialogRef: DialogComponent;
  subscriptionDetails: any;
  totalData!: number;
  
  constructor(
    private viewContainer: ViewContainerRef,
  ) {
    const _injector = this.viewContainer.injector;
    this.dialogRef = _injector.get<DialogComponent>(DialogComponent);
  }

  ngOnInit(): void {
    this.subscriptionDetails = this.dialogRef.context.data;
    this.totalData = this.subscriptionDetails.data ? parseFloat(this.subscriptionDetails.data.match(/(\d+)/)[0]) : 1;
  }

  close(): void {
    this.dialogRef.close.emit();
  }

  getUsedData(){
    return (parseFloat((this.totalData * 0.68).toFixed(2)));
  }
}
