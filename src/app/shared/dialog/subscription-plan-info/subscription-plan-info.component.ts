import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { DialogComponent } from '../../service/dialog';

@Component({
  selector: 'app-subscription-plan-info',
  templateUrl: './subscription-plan-info.component.html',
  styleUrls: ['./subscription-plan-info.component.scss']
})
export class SubscriptionPlanInfoComponent implements OnInit {

  dialogRef!: DialogComponent;
  planDetails: any;
  currencyType: string = 'USD';
  
  detailsRow: Array<any> = [
    { title: 'Plan Name', key: 'name', display: true },
    { title: 'Status', key: 'status', display: true },
    { title: 'Plan Expiry', key: 'expiryDate', isDate: true, display: true },
    { title: 'Earned Reward Points', key: 'earnedPoints', display: true },
    { title: 'Used Reward Points', key: 'rewardPointsRedeemed', display: true },
    { title: 'Coupon Code', key: 'couponCode', display: true },
    { title: 'ICCID', key: 'iccid', display: true },
    { title: 'Activation Code', key: 'activationCode', customClass: '', display: true },
  ];
  constructor(
    private viewContainer: ViewContainerRef
  ) {
    const _injector = this.viewContainer.injector;
    this.dialogRef = _injector.get<DialogComponent>(DialogComponent);
  }

  ngOnInit(): void {
    this.currencyType = localStorage.getItem('currency')!;
    this.planDetails = this.dialogRef.context.data;
  }

  close(): void {
    this.dialogRef.close.emit();
  }
}
