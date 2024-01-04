import { Component, OnDestroy, OnInit } from '@angular/core';
import { PaginationInstance } from 'ngx-pagination';
import { Coupon } from 'src/app/modules/coupon-management/model/coupon.model';
import { AlertService, DialogService } from 'src/app/shared/service';
import { CouponInfoComponent } from './component/coupon-info/coupon-info.component';
import { AddCouponComponent } from './component/add-coupon/add-coupon.component';
import { CouponManagementService } from './service/coupon-management.service';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-coupon-management',
  templateUrl: './coupon-management.component.html',
  styleUrls: ['./coupon-management.component.scss'],
})
export class CouponManagementComponent implements OnInit, OnDestroy {
  couponsList!: Coupon[];
  couponsSubscription!: Subscription;

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

  constructor(
    private couponService: CouponManagementService,
    private dialogService: DialogService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.getCouponList();
  }

  getCouponList() {
    this.inProgress = true;
    this.couponsSubscription = this.couponService.getCouponList().subscribe(
      (response: any) => {
        if (response && response.data && response.data?.length > 0) {
          this.couponsList = response.data;
          this.paginateConfig.totalItems = response?.count[0]?.totalCount;
          this.inProgress = false;
        }
      },
      (error) => {
        this.inProgress = false;
        this.alertService.error(error.error.message);
      }
    );
  }

  showInfo(coupon: Coupon): void {
    this.dialogService.openModal(CouponInfoComponent, {
      cssClass: 'modal-sm',
      context: { data: coupon },
    });
  }

  openAddNewCoupon(): void {
    this.dialogService
      .openModal(AddCouponComponent, { cssClass: 'modal-lg' })
      .instance.close.subscribe((res) => {
        if (res && res.code == 200) {
          this.getCouponList();
        }
      });
  }

  playAndPauseCoupon(coupon: any, isActive: boolean) {
    this.inProgress = true;
    this.couponService.playAndPauseCoupon(coupon, isActive).subscribe(
      (res: any) => {
        if (res.code == 200) {
          let index = this.couponsList.findIndex(
            (item: any) => item._id === coupon._id
          );
          this.couponsList[index] = res.data;
          this.alertService.success(res.message);
          this.inProgress = false;
        }
      },
      (error) => {
        this.alertService.error(error.error.message);
        this.inProgress = false;
      }
    );
  }

  getPageNumber(event: any) {
    this.inProgress = true;
    this.paginateConfig.currentPage = event;
    this.couponService
      .getCouponList(
        this.paginateConfig.itemsPerPage,
        this.paginateConfig.currentPage - 1
      )
      .subscribe(
        (response: any) => {
          if (response && response.data && response.data?.length > 0) {
            this.couponsList = response.data;
            this.paginateConfig.totalItems = response?.count[0]?.totalCount;
            this.inProgress = false;
          }
        },
        (err) => {
          this.alertService.error(err.error.message);
          this.inProgress = false;
        }
      );
  }

  // Copy user email
  copyToClipboard(event: MouseEvent, email: string | undefined) {
    event.preventDefault();

    if (!email) {
      return;
    }

    navigator.clipboard.writeText(email);
  }

  ngOnDestroy(): void {
    this.couponsSubscription.unsubscribe();
  }
}
