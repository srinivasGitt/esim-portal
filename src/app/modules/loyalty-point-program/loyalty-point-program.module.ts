import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { LoyaltyPointProgramRoutingModule } from './loyalty-point-program-routing.module';
import { LoyaltyPointProgramComponent } from './loyalty-point-program.component';

@NgModule({
  declarations: [LoyaltyPointProgramComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    LoyaltyPointProgramRoutingModule,
  ],
})
export class LoyaltyPointProgramModule {}
