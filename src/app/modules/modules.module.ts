import { ComponentFactoryResolver, ModuleWithProviders, NgModule } from "@angular/core";
import { CommonModule, CurrencyPipe } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { UserComponent } from "./user/user.component";
import { SubscriptionComponent } from "./subscription/subscription.component";
import { PlanComponent } from "./plan/plan.component";
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReportsComponent } from './reports/reports.component';
import { InventoryComponent } from './inventory/inventory.component';
import { CustomerManagementComponent } from './customer-management/customer-management.component';
import { RouterModule } from "@angular/router";
import { SubscribeManagementComponent } from './subscribe-management/subscribe-management.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { FilterPipe } from "../shared/pipe/filter.pipe";
import { SharedModule } from "../shared/shared.module";
import { ShowentriesPipe } from "../shared/pipe/showentries.pipe";
import { NgApexchartsModule } from "ng-apexcharts";
import { MatNativeDateModule } from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { SettingsComponent } from './settings/settings.component';
import { HelpCenterComponent } from './help-center/help-center.component';
import { SupportComponent } from './help-center/support/support.component';
import { ContactusComponent } from './help-center/contactus/contactus.component';


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
    ContactusComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    NgSelectModule ,
    NgxPaginationModule,
    NgApexchartsModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatDatepickerModule
  ],
  exports: [
    UserComponent,
    SubscriptionComponent,
    PlanComponent,
    DashboardComponent
  ],
  providers: [CurrencyPipe]
})

export class ModulesModule {
  static forRoot(): ModuleWithProviders<ModulesModule> {
    return {
      ngModule: ModulesModule,
      providers: [CurrencyPipe]
    }
  }
  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
  }
  public resolveComponent(component: any) {
    return this.componentFactoryResolver.resolveComponentFactory(component);
  }
}
