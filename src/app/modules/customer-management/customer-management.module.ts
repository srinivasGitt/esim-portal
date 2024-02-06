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


@NgModule({
  declarations: [
    CustomerManagementComponent,
    AddEditCustomerComponent
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
  ]
})
export class CustomerManagementModule { }
