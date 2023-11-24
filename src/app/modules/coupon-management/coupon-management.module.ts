import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CouponManagementRoutingModule } from './coupon-management-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { ShowentriesPipe } from 'src/app/shared/pipe/showentries.pipe';
import { CouponInfoComponent } from './component/coupon-info/coupon-info.component';
import { AddCouponComponent } from './component/add-coupon/add-coupon.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';


@NgModule({
  declarations: [
    CouponInfoComponent,
    AddCouponComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgxPaginationModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    CouponManagementRoutingModule
  ]
})
export class CouponManagementModule { }
