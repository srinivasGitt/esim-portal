import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ComponentFactoryResolver, ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { QRCodeModule } from 'angularx-qrcode';

import { DialogService } from './service/dialog';

import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxGaugeModule } from 'ngx-gauge';

import {
  LoadingSpinnerComponent,
  NavbarComponent,
  NotFoundComponent,
  SidebarComponent,
} from './component';

import {
  AlertComponent,
  AssignProfilesComponent,
  ConfirmComponent,
  ContactSupportInfoComponent,
  CustomerComponent,
  DownloadSampleFileComponent,
  ImportProfileComponent,
  InventoryInfoComponent,
  InviteSubscriberComponent,
  InviteUserComponent,
  PlanDialogComponent,
  PlanInfoComponent,
  ProfileLogComponent,
  QrCodePopupComponent,
  ReportAlertComponent,
  SubscriberInfoComponent,
  SubscriberMgmtComponent,
  SubscriptionDialogComponent,
  SubscriptionInfoComponent,
  SubscriptionRefundComponent,
  UploadInventoryComponent,
  UserInfoComponent,
  UserMgmtComponent,
} from './dialog';

import {
  EventBlockerDirective,
  NumberOnlyDirective,
  StatusColorDirective,
  TooltipDirective,
} from './directive';

import { CurrencySymbolPipe, FilesizePipe, PhoneNumberMaskPipe, ShowentriesPipe } from './pipe';
import { SearchFilterPipe } from './pipe/search-filter.pipe';

@NgModule({
  declarations: [
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
    UploadInventoryComponent,
    DownloadSampleFileComponent,
    LoadingSpinnerComponent,
    InventoryInfoComponent,
    NotFoundComponent,
    ContactSupportInfoComponent,
    SubscriptionRefundComponent,
    TooltipDirective,
    EventBlockerDirective,
    StatusColorDirective,
    ReportAlertComponent,
    NumberOnlyDirective,
    FilesizePipe,
    PhoneNumberMaskPipe,
    CurrencySymbolPipe,
    ShowentriesPipe,
    SearchFilterPipe
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
    MatInputModule,
  ],
  exports: [
    SubscriptionDialogComponent,
    SidebarComponent,
    NavbarComponent,
    ConfirmComponent,
    UserMgmtComponent,
    TooltipDirective,
    LoadingSpinnerComponent,
    FormsModule,
    ReactiveFormsModule,
    StatusColorDirective,
    CurrencySymbolPipe,
    NumberOnlyDirective,
    ShowentriesPipe
  ],
  providers: [CurrencyPipe, DatePipe],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [DialogService, CurrencyPipe],
    };
  }
  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}
  public resolveComponent(component: any) {
    return this.componentFactoryResolver.resolveComponentFactory(component);
  }
}
