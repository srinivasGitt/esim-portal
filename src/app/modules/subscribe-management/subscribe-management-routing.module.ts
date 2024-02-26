import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubscribeManagementComponent } from './subscribe-management.component';
import { SubscriberSubscriptionsComponent } from './subscriber-subscriptions/subscriber-subscriptions.component';

const routes: Routes = [
  { path:'', component: SubscribeManagementComponent},
  { path:':id', component: SubscriberSubscriptionsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubscribeManagementRoutingModule { }
