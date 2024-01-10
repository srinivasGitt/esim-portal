import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddCouponComponent } from './component/add-coupon/add-coupon.component';
import { StepOneComponent } from './component/add-coupon/stepper/step-one/step-one.component';
import { StepThreeComponent } from './component/add-coupon/stepper/step-three/step-three.component';
import { StepTwoComponent } from './component/add-coupon/stepper/step-two/step-two.component';
import { CouponInfoComponent } from './component/coupon-info/coupon-info.component';
import { CouponManagementRoutingModule } from './coupon-management-routing.module';

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
    CouponManagementRoutingModule,
  ],
})
export class CouponManagementModule {}
