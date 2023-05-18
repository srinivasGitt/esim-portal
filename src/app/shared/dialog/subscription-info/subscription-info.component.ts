import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { DialogComponent } from '../../service/dialog';
import { SubscriptionsService } from '../../service';

@Component({
  selector: 'app-subscription-info',
  templateUrl: './subscription-info.component.html',
  styleUrls: ['./subscription-info.component.scss']
})
export class SubscriptionInfoComponent implements OnInit {

  dialogRef: DialogComponent;
  subscriptionDetails: any;
  totalData!: number;
  usedData!: number;
  
  constructor(
    private viewContainer: ViewContainerRef, private subscriptionService: SubscriptionsService
  ) {
    const _injector = this.viewContainer.injector;
    this.dialogRef = _injector.get<DialogComponent>(DialogComponent);
  }

  ngOnInit(): void {
    this.subscriptionDetails = this.dialogRef.context.data;
    this.totalData = this.subscriptionDetails.data ? parseFloat(this.subscriptionDetails.data.match(/(\d+)/)[0]) : 1;
    console.log(this.subscriptionDetails)
    this.getSubscriptionDataUsage(this.subscriptionDetails._id)
  }

  close(): void {
    this.dialogRef.close.emit();
  }

  getUsedDataCa(){
    return (parseFloat((this.totalData * 0.68).toFixed(2)));
  }
  
  getSubscriptionDataUsage(id: string){
    this.subscriptionService.getSubscriptionDataUsage(id).subscribe((res: any) => {
      if(res) {
        this.usedData = res.used_data_size_in_GB
      }
    })
  }
}
