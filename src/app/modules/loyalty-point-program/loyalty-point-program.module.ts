import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoyaltyPointProgramRoutingModule } from './loyalty-point-program-routing.module';
import { LoyaltyPointProgramComponent } from './loyalty-point-program.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    LoyaltyPointProgramComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    LoyaltyPointProgramRoutingModule
  ]
})
export class LoyaltyPointProgramModule { }
