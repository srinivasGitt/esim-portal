import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ComponentFactoryResolver, ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { QRCodeModule } from 'angularx-qrcode';

import { DialogService } from './service/dialog';

import { MatNativeDateModule } from '@angular/material/core';
import { MatDateRangePicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxGaugeModule } from 'ngx-gauge';

import {
  LoadingSpinnerComponent,
  MobileNumberInputComponent,
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
  SaEditInviteUserComponent,
  SubscriberInfoComponent,
  SubscriberMgmtComponent,
  SubscriptionDialogComponent,
  SubscriptionInfoComponent,
  SubscriptionPlanInfoComponent,
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

import { AngularOtpLibModule } from 'src/lib/angular-otp-box';
import { OtpVerificationComponent } from './dialog/otp-verification/otp-verification.component';
import {
  CurrencyByMatchingkeyPipe,
  CurrencySymbolPipe,
  DayOrDatePipe,
  FilesizePipe,
  FilterPipe,
  KeyToDisplayPipe,
  PhoneNumberMaskPipe,
  RoleCheckPipe,
  SearchFilterPipe,
  ShowentriesPipe,
} from './pipe';

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
    OtpVerificationComponent,
    SearchFilterPipe,
    SaEditInviteUserComponent,
    MobileNumberInputComponent,
    ShowentriesPipe,
    SearchFilterPipe,
    DayOrDatePipe,
    KeyToDisplayPipe,
    CurrencyByMatchingkeyPipe,
    RoleCheckPipe,
    FilterPipe,
    SubscriptionPlanInfoComponent
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
    AngularOtpLibModule,
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
    FilterPipe,
    ShowentriesPipe,
    MobileNumberInputComponent,
    DayOrDatePipe,
    KeyToDisplayPipe,
    MatNativeDateModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatDateRangePicker,
    CurrencyByMatchingkeyPipe,
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
