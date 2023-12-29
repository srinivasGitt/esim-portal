import { Component } from '@angular/core';
import { PaginationInstance } from 'ngx-pagination';
import { Coupon } from 'src/app/modules/coupon-management/model/coupon.model';
import { DialogService } from 'src/app/shared/service';
import { CouponInfoComponent } from './component/coupon-info/coupon-info.component';
import { AddCouponComponent } from './component/add-coupon/add-coupon.component';

@Component({
  selector: 'app-coupon-management',
  templateUrl: './coupon-management.component.html',
  styleUrls: ['./coupon-management.component.scss'],
})
export class CouponManagementComponent {
  couponsList: Array<Coupon> = [
    {
      code: 'OCTSALE20%',
      total: 120,
      used: 40,
      remaining: 80,
      discountType: 'Percentage',
      discountValue: '20%',
      startDate: '23-10-2023',
      endDate: '23-11-2023',
      isActive: true,
    },
    {
      code: 'OCTSALE20%',
      total: 120,
      used: 40,
      remaining: 80,
      discountType: 'Percentage',
      discountValue: '20%',
      startDate: '23-10-2023',
      endDate: '23-11-2023',
      isActive: false,
    },
  ];
  paginateConfig: PaginationInstance = {
    id: 'couponListPagination',
    itemsPerPage: 20,
    currentPage: 1,
    totalItems: 0,
  };

  inProgress: boolean = false;
  inSearch: boolean = false;
  copyText: string = 'Copy';
  currencyType: string = 'USD';

  constructor(private dialogService: DialogService) {}

  showInfo(coupon: Coupon): void {
    this.dialogService.openModal(CouponInfoComponent, {
      cssClass: 'modal-sm',
      context: { data: coupon },
    });
  }

  openAddNewCoupon(): void {
    this.dialogService.openModal(AddCouponComponent, { cssClass: 'modal-lg' });
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
