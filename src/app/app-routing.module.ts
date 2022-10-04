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


const routes: Routes = [
  {
    path: '',
    component: CoreComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'users', component: UserComponent },
      { path: 'plans', component: PlanComponent },
      { path: 'subscriptions', component: SubscriptionComponent },
      { path: 'reports', component: ReportsComponent},
      { path: 'inventory', component: InventoryComponent}
    ]
  },
  {
    path: 'signin',
    component: SigninComponent
  }
  ,
  // {
  //   path: 'forgot-password',
  //   component: ForgotPasswordComponent
  // },
  // {
  //   path: 'reset-password',
  //   component: ResetPasswordComponent
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
