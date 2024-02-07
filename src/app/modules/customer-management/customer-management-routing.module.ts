import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEditCustomerComponent } from './component/add-edit-customer/add-edit-customer.component';
import { CustomerManagementComponent } from './customer-management.component';

const routes: Routes = [
  { path: '', component: CustomerManagementComponent },
  { path: 'add', component: AddEditCustomerComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerManagementRoutingModule {}
