import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';

import { SubscribeManagementRoutingModule } from './subscribe-management-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from 'src/app/shared/shared.module';
import { SubscribeManagementComponent } from './subscribe-management.component';
import { SubscriberSubscriptionsComponent } from './subscriber-subscriptions/subscriber-subscriptions.component';


@NgModule({
  declarations: [
    SubscribeManagementComponent,
    SubscriberSubscriptionsComponent
  ],
  imports: [
    CommonModule,
    SubscribeManagementRoutingModule,
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
  providers: [ CurrencyPipe ]
})
export class SubscribeManagementModule { }
