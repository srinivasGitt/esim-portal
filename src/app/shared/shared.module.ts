import { ComponentFactoryResolver, ModuleWithProviders, NgModule } from "@angular/core";
import { CommonModule, CurrencyPipe } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { DialogService } from "./service/dialog";
import { SubscriptionDialogComponent } from './dialog/subscription/subscription.component';
import { SidebarComponent } from './component/sidebar/sidebar.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import { HttpClientModule } from "@angular/common/http";
import { AuthService } from "./service/auth.service";
import { ConfirmComponent } from './dialog/confirm/confirm.component';
import { UserMgmtComponent } from './dialog/user-mgmt/user-mgmt.component';
import { PlanDialogComponent } from './dialog/plan-dialog/plan-dialog.component';
import { QrCodePopupComponent } from './dialog/qr-code-popup/qr-code-popup.component';
// import { SubscriptionComponent } from "../modules/subscription/subscription.component";
@NgModule({
  declarations: [
    // SubscriptionComponent,
    SubscriptionDialogComponent,
    ConfirmComponent,
    SidebarComponent,
    NavbarComponent,
    ConfirmComponent,
    UserMgmtComponent,
    PlanDialogComponent,
    QrCodePopupComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  exports: [
    // SubscriptionComponent,
    SubscriptionDialogComponent,
    SidebarComponent,
    NavbarComponent,
    ConfirmComponent,
    UserMgmtComponent,
  ],
  providers: [CurrencyPipe]
})

export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [DialogService, CurrencyPipe]
    }
  }
  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
  }
  public resolveComponent(component: any) {
    return this.componentFactoryResolver.resolveComponentFactory(component);
  }
}
