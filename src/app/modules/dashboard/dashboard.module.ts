import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AdminDashboardComponent } from './component/admin-dashboard/admin-dashboard.component';
import { SuperAdminDashboardComponent } from './component/super-admin-dashboard/super-admin-dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';

@NgModule({
  declarations: [SuperAdminDashboardComponent, AdminDashboardComponent],
  imports: [CommonModule, DashboardRoutingModule],
})
export class DashboardModule {}
