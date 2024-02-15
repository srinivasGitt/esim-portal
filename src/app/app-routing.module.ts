import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPasswordComponent, ResetPasswordComponent, SigninComponent } from './auth';
import { CoreComponent } from './core/core.component';
import {
  ContactusComponent,
  DashboardComponent,
  DataUsageComponent,
  HelpCenterComponent,
  InventoryComponent,
  PlanComponent,
  ReportsComponent,
  RevenueComponent,
  SettingsComponent,
  SubscribeManagementComponent,
  SubscriberComponent,
  SubscriptionComponent,
  SubscriptionReportComponent,
  SupportComponent,
  UserComponent,
} from './modules';
import { NotFoundComponent } from './shared/component';
import { AuthGuard, CanMatchRoute } from './shared/service';

const routes: Routes = [
  {
    path: '',
    component: CoreComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: DashboardComponent },
      {
        path: 'customer-management',
        loadChildren: () =>
          import('./modules/customer-management/customer-management.module').then(
            (m) => m.CustomerManagementModule
          ),
        canMatch: [CanMatchRoute]
      },
      { path: 'subscribers', component: SubscribeManagementComponent },
      { path: 'subscriptions', component: SubscriptionComponent },
      { path: 'user-management', component: UserComponent },
      { path: 'user-management/:custId', component: UserComponent },
      { path: 'plans', component: PlanComponent },
      {
        path: 'reports',
        component: ReportsComponent,
        children: [
          { path: 'revenue', component: RevenueComponent },
          { path: 'data-usage', component: DataUsageComponent },
          { path: 'subscriber', component: SubscriberComponent },
          { path: 'subscription', component: SubscriptionReportComponent },
        ],
      },
      { path: 'inventory', component: InventoryComponent },
      { path: 'setting', component: SettingsComponent },
      {
        path: 'help-center',
        component: HelpCenterComponent,
        children: [
          { path: 'contactus', component: ContactusComponent },
          { path: 'support', component: SupportComponent },
        ],
      },
      {
        path: 'coupon-management',
        loadChildren: () =>
          import('./modules/coupon-management/coupon-management.module').then(
            (m) => m.CouponManagementModule
          ),
        data: {
          couponCodesMasterEnabled: true,
        },
      },
      {
        path: 'loyalty-point-program',
        loadChildren: () =>
          import('./modules/loyalty-point-program/loyalty-point-program.module').then(
            (m) => m.LoyaltyPointProgramModule
          ),
        data: {
          rewardPointsMasterEnabled: true,
        },
      },
    ],
  },
  {
    path: 'signin',
    component: SigninComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path: 'reset-password/:token',
    component: ResetPasswordComponent,
  },
  {
    path: '',
    component: ResetPasswordComponent,
  },
  {
    path: '',
    redirectTo: '/signin',
    pathMatch: 'full',
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
