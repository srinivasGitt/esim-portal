import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { AlertService } from 'src/app/shared/service';
import { DialogComponent } from 'src/app/shared/service/dialog';
import { CouponManagementService } from '../../service/coupon-management.service';

@Component({
  selector: 'app-coupon-info',
  templateUrl: './coupon-info.component.html',
  styleUrls: ['./coupon-info.component.scss'],
})
export class CouponInfoComponent implements OnInit {
  dialogRef: DialogComponent;
  couponId!: string;
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
    private couponService: CouponManagementService
  ) {
    const _injector = this.viewContainer.injector;
    this.dialogRef = _injector.get<DialogComponent>(DialogComponent);
  }

  ngOnInit(): void {
    const couponData = this.dialogRef.context.data;
    this.couponId = couponData._id;
    this.getCouponDetails(this.couponId);
  }

  getCouponDetails(couponId: string) {
    this.inProgress = true;
    this.couponService.getCouponById(couponId).subscribe(
      (response: any) => {
        if (response) {
          this.couponDetails = response.data[0];
        }
        this.inProgress = false;
      },
      (error) => {
        this.alertService.error(error.error.message);
        this.inProgress = false;
      }
    );
  }

  close(): void {
    this.dialogRef.close.emit();
  }

  displayList(items: any) {
    return items
      .map((item: any) => item.name)
      .slice(1)
      .join(', ');
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
