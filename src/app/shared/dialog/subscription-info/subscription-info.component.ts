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
  copyText: string = 'Copy'
  currencyType: string = 'USD';
  dataUnit!: string;
  inProgress: boolean = false;

  constructor(
    private viewContainer: ViewContainerRef, private subscriptionService: SubscriptionsService
  ) {
    const _injector = this.viewContainer.injector;
    this.dialogRef = _injector.get<DialogComponent>(DialogComponent);
  }

  ngOnInit(): void {
    this.currencyType = localStorage.getItem('currency')!;
    this.subscriptionDetails = this.dialogRef.context.data;
    this.totalData = this.subscriptionDetails.data ? parseFloat(this.subscriptionDetails.data.match(/(\d+)/)[0]) : 1;
    this.getSubscriptionDataUsage(this.subscriptionDetails._id)
  }

  close(): void {
    this.dialogRef.close.emit();
  }

  getUsedDataCa(){
    return (parseFloat((this.totalData * 0.68).toFixed(2)));
  }
  
  getSubscriptionDataUsage(id: string){
    this.inProgress = true
    this.subscriptionService.getSubscriptionDataUsage(id).subscribe((res: any) => {
      if(res) {
        
        if(res.used_data_size_in_MB > 1000) {
          this.dataUnit = 'GB'     
          this.usedData = res.used_data_size_in_GB     
        }
        else {
          this.dataUnit = 'MB'     
          this.usedData = res.used_data_size_in_MB     
        }
    
        this.inProgress = false
      }
    }, error => {
      this.inProgress = false
    })
  }

  // Copy user email
  copyToClipboard(event: MouseEvent, email: string | undefined) {
    event.preventDefault();

    if(!email) {
      return;
    }
    navigator.clipboard.writeText(email);
  }
}
