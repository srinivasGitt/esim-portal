import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddEditCustomerComponent } from './component/add-edit-customer/add-edit-customer.component';
import { SingleCustomerViewComponent } from './component/single-customer-view/single-customer-view.component';
import { StepOneComponent } from './component/stepper/step-one/step-one.component';
import { StepThreeComponent } from './component/stepper/step-three/step-three.component';
import { StepTwoComponent } from './component/stepper/step-two/step-two.component';
import { CustomerManagementRoutingModule } from './customer-management-routing.module';
import { CustomerManagementComponent } from './customer-management.component';
import { SettingsComponent } from './component/settings/settings.component';

@NgModule({
  declarations: [
    CustomerManagementComponent,
    AddEditCustomerComponent,
    StepOneComponent,
    StepTwoComponent,
    StepThreeComponent,
    SingleCustomerViewComponent,
    SettingsComponent,
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
