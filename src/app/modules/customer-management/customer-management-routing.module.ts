import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEditCustomerComponent } from './component/add-edit-customer/add-edit-customer.component';
import { SingleCustomerViewComponent } from './component/single-customer-view/single-customer-view.component';
import { CustomerManagementComponent } from './customer-management.component';

const routes: Routes = [
  { path: '', component: CustomerManagementComponent },
  { path: 'add', component: AddEditCustomerComponent },
  { path: 'edit/:id', component: AddEditCustomerComponent },
  { path: ':custId', component: SingleCustomerViewComponent },
  { path: ':pid/:custId', component: SingleCustomerViewComponent },
  { path: ':pid/:child1/:custId', component: SingleCustomerViewComponent },
  { path: ':pid/:child1/:child2/:custId', component: SingleCustomerViewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerManagementRoutingModule {}
