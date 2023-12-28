import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoyaltyPointProgramComponent } from './loyalty-point-program.component';

const routes: Routes = [{ path: '', component: LoyaltyPointProgramComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoyaltyPointProgramRoutingModule {}
