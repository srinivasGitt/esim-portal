import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoyaltyPointProgramRoutingModule } from './loyalty-point-program-routing.module';
import { LoyaltyPointProgramComponent } from './loyalty-point-program.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    LoyaltyPointProgramComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    LoyaltyPointProgramRoutingModule
  ]
})
export class LoyaltyPointProgramModule { }
