import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from './auth/signin/signin.component';
// import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
// import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { CoreComponent } from './core/core.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { UserComponent } from './modules/user/user.component';
import { PlanComponent } from './modules/plan/plan.component';
import { SubscriptionComponent } from './modules/subscription/subscription.component';
import { ReportsComponent } from './modules/reports/reports.component';
import { InventoryComponent } from './modules/inventory/inventory.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { CustomerManagementComponent } from './modules/customer-management/customer-management.component';
import { SubscribeManagementComponent } from './modules/subscribe-management/subscribe-management.component';
import { AuthGuard } from './shared/service/auth/auth.guard';
import { NotFoundComponent } from './shared/component/not-found/not-found.component';


const routes: Routes = [
  {
    path: '',
    component: CoreComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: DashboardComponent },
      { path: 'customer-management', component: CustomerManagementComponent },
      { path: 'customer-management/:id', component: CustomerManagementComponent },
      { path: 'subscriber', component: SubscribeManagementComponent },
      { path: 'subscriptions', component: SubscriptionComponent },
      { path: 'user-management', component: UserComponent },
      { path: 'user-management/:custId', component: UserComponent },
      { path: 'plans', component: PlanComponent },
      { path: 'reports', component: ReportsComponent},
      { path: 'inventory', component: InventoryComponent}
    ]
  },
  {
    path: 'signin',
    component: SigninComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'reset-password/:token',
    component: ResetPasswordComponent
  },
  {
    path: '',
    component: ResetPasswordComponent
  },
  {
    path: '',
    redirectTo: '/signin',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: NotFoundComponent
  }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
