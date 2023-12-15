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
import { NgSelectModule } from '@ng-select/ng-select';
import { StepOneComponent } from './component/add-coupon/stepper/step-one/step-one.component';
import { StepTwoComponent } from './component/add-coupon/stepper/step-two/step-two.component';
import { StepThreeComponent } from './component/add-coupon/stepper/step-three/step-three.component';


@NgModule({
  declarations: [
    CouponInfoComponent,
    AddCouponComponent,
    StepOneComponent,
    StepTwoComponent,
    StepThreeComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgxPaginationModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatInputModule,
    NgSelectModule,
    CouponManagementRoutingModule
  ]
})
export class CouponManagementModule { }
