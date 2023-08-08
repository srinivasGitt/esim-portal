import { ComponentFactoryResolver, ModuleWithProviders, NgModule } from "@angular/core";
import { CommonModule, CurrencyPipe, DatePipe } from "@angular/common";
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
import { PlanInfoComponent, SubscriptionInfoComponent, SubscriberInfoComponent,UserInfoComponent } from './dialog';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxGaugeModule } from 'ngx-gauge';
import { TooltipDirective } from "./directive/tooltip.directive";
import { UploadInventoryComponent } from './dialog/upload-inventory/upload-inventory.component';
import { DownloadSampleFileComponent } from './dialog/download-sample-file/download-sample-file.component';
import { FilesizePipe } from './pipe/filesize.pipe';
import { EventBlockerDirective } from './directive/event-blocker.directive';
import { LoadingSpinnerComponent } from './component/loading-spinner/loading-spinner.component';
import { InventoryInfoComponent } from './dialog/inventory-info/inventory-info.component';
import { NotFoundComponent } from './component/not-found/not-found.component';
import { PhoneNumberMaskPipe } from './pipe/phone-number-mask.pipe';
import { MatNativeDateModule } from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { ContactSupportInfoComponent } from './dialog/contact-support-info/contact-support-info.component';
import { StatusColorDirective } from './directive/status-color.directive';

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
    SubscriptionInfoComponent,
    UserInfoComponent,
    SubscriberInfoComponent,
    TooltipDirective,
    UploadInventoryComponent,
    DownloadSampleFileComponent,
    FilesizePipe,
    EventBlockerDirective,
    LoadingSpinnerComponent,
    InventoryInfoComponent,
    NotFoundComponent,
    PhoneNumberMaskPipe,
    ContactSupportInfoComponent,
    StatusColorDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    QRCodeModule,
    RouterModule,
    NgSelectModule,
    NgxGaugeModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule
  ],
  exports: [
    // SubscriptionComponent,
    SubscriptionDialogComponent,
    SidebarComponent,
    NavbarComponent,
    ConfirmComponent,
    UserMgmtComponent,
    TooltipDirective,
    LoadingSpinnerComponent,
    FormsModule, ReactiveFormsModule,
    StatusColorDirective
  ],
  providers: [CurrencyPipe, DatePipe]
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
