import { ComponentFactoryResolver, ModuleWithProviders, NgModule } from "@angular/core";
import { CommonModule, CurrencyPipe } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { DialogService } from "./service/dialog";
import { SubscriptionDialogComponent } from './dialog/subscription/subscription.component';
import { SidebarComponent } from './component/sidebar/sidebar.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import { HttpClientModule } from "@angular/common/http";
import { ConfirmComponent } from './dialog/confirm/confirm.component';
import { UserMgmtComponent } from './dialog/user-mgmt/user-mgmt.component';
import { PlanDialogComponent } from './dialog/plan-dialog/plan-dialog.component';
import { QrCodePopupComponent } from './dialog/qr-code-popup/qr-code-popup.component';
import { QRCodeModule } from "angularx-qrcode";
import {RouterModule} from '@angular/router';
import { CustomerComponent } from './dialog/customer/customer.component';
import { InviteUserComponent } from './dialog/invite-user/invite-user.component';

import { InviteSubscriberComponent } from './dialog/invite-subscriber/invite-subscriber.component';
import { SubscriberMgmtComponent } from './dialog/subscriber-mgmt/subscriber-mgmt.component';

import { AlertComponent } from './dialog/alert/alert.component';
import { ProfileLogComponent } from './dialog/profile-log/profile-log.component';
import { ImportProfileComponent } from './dialog/import-profile/import-profile.component';
import { AssignProfilesComponent } from './dialog/assign-profiles/assign-profiles.component';
import { PlanInfoComponent, SubscriptionInfoComponent } from './dialog';
import { NgSelectModule } from '@ng-select/ng-select';


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
    QrCodePopupComponent,
    CustomerComponent,
    InviteUserComponent,
    InviteSubscriberComponent,
    SubscriberMgmtComponent,
    AlertComponent,
    ProfileLogComponent,
    ImportProfileComponent,
    AssignProfilesComponent,
    PlanInfoComponent,
    SubscriptionInfoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    QRCodeModule,
    RouterModule,
    NgSelectModule,
    
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
