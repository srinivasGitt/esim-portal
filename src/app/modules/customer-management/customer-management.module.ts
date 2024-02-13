import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerManagementRoutingModule } from './customer-management-routing.module';
import { CustomerManagementComponent } from './customer-management.component';
import { AddEditCustomerComponent } from './component/add-edit-customer/add-edit-customer.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { RouterModule } from '@angular/router';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ShowentriesPipe } from 'src/app/shared/pipe';
import { StepOneComponent } from './component/stepper/step-one/step-one.component';
import { StepTwoComponent } from './component/stepper/step-two/step-two.component';
import { StepThreeComponent } from './component/stepper/step-three/step-three.component';
import { MobileNumberInputComponent } from 'src/app/shared/component';

@NgModule({
  declarations: [
    CustomerManagementComponent,
    AddEditCustomerComponent,
    StepOneComponent,
    StepTwoComponent,
    StepThreeComponent,
  ],
  imports: [
    CommonModule,
    CustomerManagementRoutingModule,
    RouterModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatDatepickerModule,
  ],
})
export class CustomerManagementModule {}
