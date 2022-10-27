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

@NgModule({
  declarations: [
    UserComponent,
    SubscriptionComponent,
    PlanComponent,
    DashboardComponent,
    ReportsComponent,
    InventoryComponent,
    CustomerManagementComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
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
