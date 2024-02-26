import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, catchError, forkJoin, takeUntil, throwError } from 'rxjs';
import { UserMgmtComponent } from 'src/app/shared/dialog';
import {
  OtpVerificationComponent,
  buttonText,
  otpType,
} from 'src/app/shared/dialog/otp-verification';
import { AlertService, CustomerService, DialogService } from 'src/app/shared/service';
import { CustomerModuleService } from '../../service/customer-module.service';
import { InviteAgentComponent } from '../invite-agent/invite-agent.component';

@Component({
  selector: 'app-single-customer-view',
  templateUrl: './single-customer-view.component.html',
  styleUrls: ['./single-customer-view.component.scss'],
})
export class SingleCustomerViewComponent implements OnInit, OnDestroy {
  // Define a Subject to manage the subscription
  private unsubscribe$: Subject<void> = new Subject<void>();

  customer: any;
  isEnable: boolean = false;
  customerId: any;
  customerHierarchy = [];

  constructor(
    private customerService: CustomerService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dialogService: DialogService,
    private alertService: AlertService,
    private customerModuleService: CustomerModuleService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((res: any) => {
      this.customerId = res.id;

      this.getCustomerDetails(this.customerId);
    });

    this.getCustomerHierarchy();
  }

  private getCustomerDetails(customerId: string) {
    forkJoin(this.customerModuleService.getCustomerDetailsByCustomerId(customerId))
      .pipe(
        takeUntil(this.unsubscribe$),
        catchError((error) => {
          return throwError(() => {
            this.alertService.error(error.error.message);
          });
        })
      )
      .subscribe({
        next: ([result1, result2]: any) => {
          const combinedResult = { ...result1[0], ...result2 };
          this.customer = combinedResult;
          if (this.customer.billingAddress)
            this.customer.completeAddress = `${this.customer.billingAddress.addressLine}, ${this.customer.billingAddress.city} ${this.customer.billingAddress.state} ${this.customer.billingAddress.country}- ${this.customer.billingAddress.pincode}`;

          console.log(this.customer);
        },
        error: (err: any) => {
          this.alertService.error(err.error.message);
        },
      });
  }

  editCustomer(customer: any) {
    this.router.navigate(['customers/edit', customer._id]);
  }

  getCustomerHierarchy() {
    this.customerService.getCustomerHierachy().subscribe((res: any) => {
      this.customerHierarchy = res;
    });
  }

  selectCustomer() {
    console.log(this.customerId);

    // this.customerHierarchy.filter((ele: any) => {return ele._id === this.customerId ? ele.children : []})

    let selectedCustomer;
    let selectCustomerFlg = false;

    this.customerHierarchy.forEach((ele: any) => {
      if (ele._id === this.customerId) {
        selectedCustomer = ele.children;
        selectCustomerFlg = true;
      }
    });

    if (!selectCustomerFlg) {
      selectedCustomer = [];
    }

    console.log(selectedCustomer);

    this.customerService.sendCustomer(selectedCustomer);
  }

  // Invite User
  inviteUser() {
    this.dialogService
      .openModal(UserMgmtComponent, {
        cssClass: 'modal-sm',
        context: {
          data: {},
          title: 'Invite User',
          customerId: '1',
        },
      })
      .instance.close.subscribe((data: any) => {
        if (data) {
          this.alertService.success(data.message);
        }
      });
  }

  // Invite Agent
  inviteAgent() {
    this.dialogService
      .openModal(InviteAgentComponent, {
        cssClass: 'modal-sm',
        context: {
          data: {},
          title: 'Invite Agent',
          customerId: '1',
        },
      })
      .instance.close.subscribe((data: any) => {
        if (data) {
          this.alertService.success(data.message);
        }
      });
  }

  // Enable/Disable
  enableDisable(type: string, payload: any) {
    let configObj: any = {};

    if (type === 'product') {
      configObj = {
        type: this.isEnable ? otpType.CUSTOMER_PRODUCT_ENABLE : otpType.CUSTOMER_PRODUCT_DISABLE,
        buttonText: this.isEnable ? buttonText.enable : buttonText.disable,
      };
    }
    if (type === 'feature') {
      configObj = {
        type: this.isEnable ? otpType.CUSTOMER_FEATURE_ENABLE : otpType.CUSTOMER_FEATURE_DISABLE,
        buttonText: this.isEnable ? buttonText.enable : buttonText.disable,
      };
    }
    this.dialogService
      .openModal(OtpVerificationComponent, {
        context: {
          config: configObj,
          payload: payload,
        },
      })
      .instance.close.subscribe((data: any) => {
        console.log(data);
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
