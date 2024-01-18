import { Component, OnDestroy, OnInit } from '@angular/core';
import { PaginationInstance } from 'ngx-pagination';
import { Subscription } from 'rxjs/internal/Subscription';
import { Coupon } from 'src/app/modules/coupon-management/model/coupon.model';
import { ICustomResponse } from 'src/app/shared/models';
import { AlertService, DialogService, SearchService } from 'src/app/shared/service';
import { AddCouponComponent, CouponInfoComponent } from './component';
import { CouponManagementService } from './service';

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
    private alertService: AlertService,
    private _searchService: SearchService
  ) {
    _searchService.getResults().subscribe((results: ICustomResponse) => {
      if (results) {
        this.couponsList = results?.data;
        this.paginateConfig.totalItems = results?.count[0]?.totalCount;
        this.paginateConfig.currentPage = 1;
        this.inSearch = true;
      }
    });
  }

  ngOnInit(): void {
    this.getCouponList();
  }

  getCouponList() {
    this.inProgress = true;
    this.couponsSubscription = this.couponService.getCouponList().subscribe(
      (response: ICustomResponse) => {
        if (response && response.data) {
          this.couponsList = response.data;
          this.paginateConfig.totalItems = response?.count[0]?.totalCount;
        }
        this.inProgress = false;
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

  playAndPauseCoupon(coupon: Coupon, isActive: boolean) {
    this.inProgress = true;
    this.couponService.playAndPauseCoupon(coupon, isActive).subscribe(
      (res: ICustomResponse) => {
        if (res.code == 200) {
          const index = this.couponsList.findIndex((item: Coupon) => item._id === coupon._id);
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

  getPageNumber(event: number) {
    this.inProgress = true;
    this.paginateConfig.currentPage = event;

    /* Pagination based on searched data */
    if (this.inSearch && this._searchService.searchedTerm.length > 3) {
      this._searchService
        .getSearchResult(
          '/coupon-management',
          this._searchService.searchedTerm,
          this.paginateConfig.itemsPerPage,
          this.paginateConfig.currentPage - 1
        )
        .subscribe((result: ICustomResponse) => {
          this.couponsList = result.data;
          this.paginateConfig.totalItems = result?.count[0]?.totalCount;
          this.inProgress = false;
        });
    } else {
      /* Pagination based on all data */
      this.couponService
        .getCouponList(this.paginateConfig.itemsPerPage, this.paginateConfig.currentPage - 1)
        .subscribe(
          (response: ICustomResponse) => {
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
