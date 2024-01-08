import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from './auth/signin/signin.component';
// import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
// import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { CoreComponent } from './core/core.component';
import { CustomerManagementComponent } from './modules/customer-management/customer-management.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { ContactusComponent } from './modules/help-center/contactus/contactus.component';
import { HelpCenterComponent } from './modules/help-center/help-center.component';
import { SupportComponent } from './modules/help-center/support/support.component';
import { InventoryComponent } from './modules/inventory/inventory.component';
import { PlanComponent } from './modules/plan/plan.component';
import { DataUsageComponent } from './modules/reports/data-usage/data-usage.component';
import { ReportsComponent } from './modules/reports/reports.component';
import { RevenueComponent } from './modules/reports/revenue/revenue.component';
import { SettingsComponent } from './modules/settings/settings.component';
import { SubscribeManagementComponent } from './modules/subscribe-management/subscribe-management.component';
import { SubscriptionComponent } from './modules/subscription/subscription.component';
import { UserComponent } from './modules/user/user.component';
import { NotFoundComponent } from './shared/component/not-found/not-found.component';
import { AuthGuard } from './shared/service/auth/auth.guard';


const routes: Routes = [
  {
    path: '',
    component: CoreComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: DashboardComponent },
      { path: 'customer-management', component: CustomerManagementComponent },
      { path: 'customer-management/:id', component: CustomerManagementComponent },
      { path: 'subscribers', component: SubscribeManagementComponent },
      { path: 'subscriptions', component: SubscriptionComponent },
      { path: 'user-management', component: UserComponent },
      { path: 'user-management/:custId', component: UserComponent },
      { path: 'plans', component: PlanComponent },
      { path: 'reports', component: ReportsComponent,
        children: [
          { path: 'revenue', component: RevenueComponent },
          { path: 'data-usage', component: DataUsageComponent }
        ]
      },
      { path: 'inventory', component: InventoryComponent},
      { path: 'setting', component: SettingsComponent},
      { path: 'help-center', component: HelpCenterComponent,
        children: [
          { path: 'contactus', component: ContactusComponent },
          { path: 'support', component: SupportComponent }
        ]
      },
      { path: 'loyalty-point-program',
        loadChildren: () => import('./modules/loyalty-point-program/loyalty-point-program.module').then(m => m.LoyaltyPointProgramModule),
        // canActivate: [AuthGuard],
        data: {
          rewardPointsMasterEnabled: true
        }
    }
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
