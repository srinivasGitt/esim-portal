import { CommonModule, CurrencyPipe } from '@angular/common';
import { ComponentFactoryResolver, ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { FilterPipe } from '../shared/pipe/filter.pipe';
import { ShowentriesPipe } from '../shared/pipe/showentries.pipe';
import { SharedModule } from '../shared/shared.module';
import { CouponManagementComponent } from './coupon-management/coupon-management.component';
import { CustomerManagementComponent } from './customer-management/customer-management.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ContactusComponent } from './help-center/contactus/contactus.component';
import { HelpCenterComponent } from './help-center/help-center.component';
import { SupportComponent } from './help-center/support/support.component';
import { InventoryComponent } from './inventory/inventory.component';
import { PlanComponent } from './plan/plan.component';
import { DataUsageComponent } from './reports/data-usage/data-usage.component';
import { ReportsComponent } from './reports/reports.component';
import { RevenueComponent } from './reports/revenue/revenue.component';
import { SettingsComponent } from './settings/settings.component';
import { SubscribeManagementComponent } from './subscribe-management/subscribe-management.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { UserComponent } from './user/user.component';

@NgModule({
  declarations: [
    UserComponent,
    SubscriptionComponent,
    PlanComponent,
    DashboardComponent,
    ReportsComponent,
    InventoryComponent,
    CustomerManagementComponent,
    SubscribeManagementComponent,
    FilterPipe,
    ShowentriesPipe,
    SettingsComponent,
    HelpCenterComponent,
    SupportComponent,
    ContactusComponent,
    CouponManagementComponent,
    RevenueComponent,
    DataUsageComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgxPaginationModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatDatepickerModule,
  ],
  exports: [UserComponent, SubscriptionComponent, PlanComponent, DashboardComponent],
  providers: [CurrencyPipe],
})
export class ModulesModule {
  static forRoot(): ModuleWithProviders<ModulesModule> {
    return {
      ngModule: ModulesModule,
      providers: [CurrencyPipe],
    };
  }
  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}
  public resolveComponent(component: any) {
    return this.componentFactoryResolver.resolveComponentFactory(component);
  }
}
