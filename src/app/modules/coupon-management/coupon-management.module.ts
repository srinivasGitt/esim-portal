import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CouponManagementRoutingModule } from './coupon-management-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { ShowentriesPipe } from 'src/app/shared/pipe/showentries.pipe';
import { CouponInfoComponent } from './component/coupon-info/coupon-info.component';


@NgModule({
  declarations: [
    CouponInfoComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgxPaginationModule,
    CouponManagementRoutingModule
  ]
})
export class CouponManagementModule { }
