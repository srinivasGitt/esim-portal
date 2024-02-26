import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEditCustomerComponent } from './component/add-edit-customer/add-edit-customer.component';
import { SingleCustomerViewComponent } from './component/single-customer-view/single-customer-view.component';
import { CustomerManagementComponent } from './customer-management.component';

const routes: Routes = [
  { path: '', component: CustomerManagementComponent },
  { path: 'add', component: AddEditCustomerComponent },
  { path: 'edit/:id', component: AddEditCustomerComponent },
  { path: ':id', component: SingleCustomerViewComponent },
  { path: ':id/:child2', component: SingleCustomerViewComponent },
  { path: ':id/:child2/:child3', component: SingleCustomerViewComponent },
  { path: ':id/:child2/:child3/:child4', component: SingleCustomerViewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerManagementRoutingModule {}
