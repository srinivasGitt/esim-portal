import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Coupon } from 'src/app/modules/coupon-management/model/coupon.model';
import { AlertService } from 'src/app/shared/service';
import { DialogComponent } from 'src/app/shared/service/dialog';

@Component({
  selector: 'app-coupon-info',
  templateUrl: './coupon-info.component.html',
  styleUrls: ['./coupon-info.component.scss'],
})
export class CouponInfoComponent implements OnInit {
  dialogRef: DialogComponent;
  couponDetails!: any;
  couponDetailsRow: Array<any> = [
    { title: 'Coupon Creation Date', key: 'createdAt' },
    { title: 'Coupon Code', key: 'code' },
    { title: 'Discount Type', key: 'discountType' },
    { title: 'Discount', key: 'discountValue' },
    { title: 'Start Date', key: 'startDate' },
    { title: 'End Date', key: 'endDate' },
    { title: 'Number of Coupons', key: 'total', isDate: true },
    { title: 'Min Purchase Value', key: 'minPurchaseValue' },
    { title: 'Max Purchase Value', key: 'maxPurchaseValue' },
    { title: 'Use Type', key: 'useType' },
    { title: 'Specific Plans', key: 'specificPlan' },
  ];

  usageDetailsRow: Array<any> = [
    { title: 'Used Coupon', key: 'used' },
    { title: 'Remaining Coupon', key: 'remaining' },
  ];

  copyText: string = 'Copy';
  inProgress: boolean = false;

  constructor(
    private viewContainer: ViewContainerRef,
    private alertService: AlertService,
  ) {
    const _injector = this.viewContainer.injector;
    this.dialogRef = _injector.get<DialogComponent>(DialogComponent);
  }

  ngOnInit(): void {
    this.couponDetails = this.dialogRef.context.data;
  }

  close(): void {
    this.dialogRef.close.emit();
  }

  // Copy user email
  copyToClipboard(event: MouseEvent, email: string | undefined) {
    event.preventDefault();

    if (!email) {
      return;
    }
    navigator.clipboard.writeText(email);
  }
}
