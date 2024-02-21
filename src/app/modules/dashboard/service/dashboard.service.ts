import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from '../../../shared/service/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  serverUrl = environment.serverUrl;
  private _themeSelection$ = new BehaviorSubject<any>(undefined);

  constructor(
    private http: HttpClient,
    private _localStorage: LocalStorageService
  ) {}

  setAppTheme(theme: any) {
    this._themeSelection$.next(theme);
  }

  getAppTheme() {
    return this._themeSelection$.asObservable();
  }

  getDashboardWidgets() {
    return [
      {
        title: 'Total Revenue',
        titleIcon: '/assets/images/dashboard/widgets-icon/users-icon.svg',
        detailsType: 'currency',
        detailsKey: 'revenue',
        graphIcon: '/assets/images/dashboard/widgets-icon/graph-1.svg',
        showFooter: true,
        increase: 10,
      },
      {
        title: 'Total Subscribers',
        titleIcon: '/assets/images/dashboard/widgets-icon/users-icon.svg',
        detailsType: '',
        detailsKey: 'subscriberCount',
        graphIcon: '/assets/images/dashboard/widgets-icon/graph-2.svg',
        showFooter: true,
        increase: 5,
      },
      {
        title: 'Total Subscriptions',
        titleIcon: '/assets/images/dashboard/widgets-icon/checkmark-icon.svg',
        detailsType: '',
        detailsKey: 'subscriptionCount',
        graphIcon: '/assets/images/dashboard/widgets-icon/graph-3.svg',
        showFooter: true,
        increase: 5,
      },
      {
        title: 'Active Plans',
        titleIcon: '/assets/images/dashboard/widgets-icon/plan-icon.svg',
        detailsType: '',
        detailsKey: 'planCount',
        graphIcon: '',
        showFooter: false,
        increase: 2,
      },
    ];
  }

  getRaiseTicket() {
    return 'https://support.glowingbud.com/';
  }

  /*
  getProfiles(){
    return this.http.get(`${this.serverUrl}/dashboard`, this.getHeader());
  }

  getDashboardCounts(){
    return [
      this.http.get(`${this.serverUrl}/subscriptions/totalRevenue`, this.getHeader()),
      this.http.get(`${this.serverUrl}/subscriptions/count`, this.getHeader()),
      this.http.get(`${this.serverUrl}/subscribers/count`, this.getHeader()),
      this.http.get(`${this.serverUrl}/plans/count`, this.getHeader())
    ];
  }
  */

  getProfiles() {
    return this.http.get(`${this.serverUrl}/dashboard`);
  }

  getDashboardCounts() {
    return [
      this.http.get(`${this.serverUrl}/subscriptions/totalRevenue`),
      this.http.get(`${this.serverUrl}/subscriptions/count`),
      this.http.get(`${this.serverUrl}/subscribers/count`),
      this.http.get(`${this.serverUrl}/plans/count`),
    ];
  }

  getReports(dateRangeValue?: string, fromDate?: any, toDate?: any) {
    if (dateRangeValue) {
      if (fromDate && toDate) {
        return this.http.get(
          `${this.serverUrl}/subscriptions/revenue/graph?dateRange=${dateRangeValue}&fromDate=${fromDate}&toDate=${toDate}`
        );
      } else {
        return this.http.get(
          `${this.serverUrl}/subscriptions/revenue/graph?dateRange=${dateRangeValue}`
        );
      }
    } else {
      return this.http.get(`${this.serverUrl}/subscriptions/revenue/graph?dateRange=year`);
    }
  }

  /* Super Admin Dashboard Statistics APIs - START */
  getUptimeStatistics() {
    return this.http.get(`${this.serverUrl}/statistics/uptime`);
  }

  getPlatformDataReportStatistics(type: string, fromDate?: string, toDate?: string) {
    if (fromDate && toDate) {
      return this.http.get(
        `${this.serverUrl}/statistics/superadmin-dashboard?dateRange=${type}&fromDate=${fromDate}&toDate=${toDate}`
      );
    }
    return this.http.get(`${this.serverUrl}/statistics/superadmin-dashboard?dateRange=${type}`);
  }

  getActivityLog(lastId?: string) {
    if (lastId) {
      return this.http.get(`${this.serverUrl}/logs/recent?lastId=${lastId}`);
    }
    return this.http.get(`${this.serverUrl}/logs/recent`);
  }

  getSuperAdminDashboardStatisticsData() {
    return [
      this.http.get(`${this.serverUrl}/statistics/uptime`),
      this.http.get(`${this.serverUrl}/statistics/superadmin-dashboard?dateRange=week`),
      this.http.get(`${this.serverUrl}/logs/recent`),
    ];
  }
  /* Super Admin Dashboard Statistics APIs - END */
}
