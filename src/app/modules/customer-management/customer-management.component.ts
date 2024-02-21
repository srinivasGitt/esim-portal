import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginationInstance } from 'ngx-pagination';
import {
  OtpVerificationComponent,
  buttonText,
  otpType,
} from 'src/app/shared/dialog/otp-verification';
import { Customer } from 'src/app/shared/models/customer';
import { SearchService } from 'src/app/shared/service';
import { AlertService } from 'src/app/shared/service/alert.service';
import { DialogService } from 'src/app/shared/service/dialog';
import { CustomerService } from './service/customer.service';

@Component({
  selector: 'app-customer-management',
  templateUrl: './customer-management.component.html',
  styleUrls: ['./customer-management.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-IN' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class CustomerManagementComponent implements OnInit {
  customerList: Customer[] = [
    {
      _id: '1',
      billingAddress: {
        addressLine: 'sdfsdfsdfsf',
        landmark: 'NY square',
        pincode: '999999',
        city: 'llllllllll',
        country: 'India',
        state: 'lllllllllllllllll',
      },
      companyName: 'ppppppppp',
      contactDetails: { emailAddress: 'adb@adc.com', phoneNumber: '+91 999999999' },
      products: {
        iosApp: true,
        androidApp: false,
        api: false,
        trs: false,
        sdk: false,
        webapp: true,
        shopifyApp: true,
      },
      userInvite: {
        firstName: 'sdfssss',
        lastName: 'sssssssss',
        email: 'adb@adc.com',
        number: '0999999999',
        role: 'Admin',
      },
      websiteLink: 'www.xyz.com',
      createdAt: '12/12/2024',
      subscriberCount: 5,
      isActive: false,
    },
  ];
  paginateConfig: PaginationInstance = {
    id: 'customerListPagination',
    itemsPerPage: 20,
    currentPage: 1,
  };
  inProgress: boolean = false;
  inSearch: boolean = false;

  constructor(
    private customerService: CustomerService,
    private dialogService: DialogService,
    private alertService: AlertService,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private router: Router,
    private route: ActivatedRoute,
    private _searchService: SearchService
  ) {
    _searchService.getResults().subscribe((results: any) => {
      if (results) {
        this.customerList = results?.data;
        this.paginateConfig.totalItems = results?.count[0]?.totalCount;
        this.paginateConfig.currentPage = 1;
        this.inSearch = true;
      }
    });
  }

  ngOnInit(): void {}

  createCustomer() {
    this.router.navigate(['add'], { relativeTo: this.route });
  }

  getAllCustomer() {
    this.inProgress = true;
    this.customerService.getCustomersList().subscribe(
      (res: any) => {
        if (res) {
          this.customerList = res.data;
          this.paginateConfig.totalItems = res?.count[0]?.totalCount;
          this.inProgress = false;
        }
      },
      (err) => {
        this.alertService.error(err.error.message, err.status);
        this.inProgress = false;
      }
    );
  }

  editCustomer(customer: any) {
    this.router.navigate(['edit', customer._id], { relativeTo: this.route });
  }

  // Active / Deactivate Customer
  activateCustomer(customer: any) {
    this.dialogService
      .openModal(OtpVerificationComponent, {
        context: {
          config: {
            type: customer.isActive ? otpType.CUSTOMER_ENABLE : otpType.CUSTOMER_DISABLE,
            buttonText: customer.isActive ? buttonText.enable : buttonText.disable,
          },
          payload: {},
        },
      })
      .instance.close.subscribe(
        (res: any) => {
          this.alertService.success(res.message);
        },
        (err) => {
          this.alertService.error(err.error.message, err.status);
          this.inProgress = false;
        }
      );
  }

  getPageNumber(event: any) {
    this.inProgress = true;
    this.paginateConfig.currentPage = event;

    /* Pagination based on searched data */
    if (this.inSearch && this._searchService.searchedTerm.length > 3) {
      this._searchService
        .getSearchResult(
          '/plans',
          this._searchService.searchedTerm,
          this.paginateConfig.itemsPerPage,
          this.paginateConfig.currentPage - 1
        )
        .subscribe((result: any) => {
          this.customerList = result.data;
          this.paginateConfig.totalItems = result?.count[0]?.totalCount;
          this.inProgress = false;
        });
    } else {
      /* Pagination based on all data */
      this.customerService
        .getCustomersList(this.paginateConfig.itemsPerPage, this.paginateConfig.currentPage - 1)
        .subscribe(
          (res: any) => {
            this.customerList = res.data;
            this.paginateConfig.totalItems = res?.count[0]?.totalCount;
            this.inProgress = false;
          },
          (err) => {
            this.alertService.error(err.error.message, err.status);
            this.inProgress = false;
          }
        );
    }
  }
}
