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

  getNavBarMenus(roles: Array<string>) {
    const navMenuList = [
      {
        title: 'Dashboard',
        icon: 'assets/icons/dashboard-icon.svg',
        link: '/',
        accessRole: ['admin', 'superAdmin'],
        hasGroup: false,
      },
      {
        title: 'Customers',
        icon: 'assets/icons/customer-icon.svg',
        link: '/customer-management',
        accessRole: ['superAdmin'],
        hasGroup: false,
      },
      {
        title: 'User Management',
        icon: 'assets/icons/manage_accounts.svg',
        link: '/user-management',
        accessRole: ['admin', 'superAdmin'],
        hasGroup: false,
      },
      {
        title: 'Plans',
        icon: 'assets/icons/plans-icon.svg',
        link: '/plans',
        accessRole: ['admin', 'superAdmin'],
        hasGroup: false,
      },
      {
        title: 'Subscribers',
        icon: 'assets/icons/subscriber-icon.svg',
        link: '/subscribers',
        accessRole: ['admin', 'superAdmin'],
        hasGroup: false,
      },
      {
        title: 'Subscriptions',
        icon: 'assets/icons/subscription-icon.svg',
        link: '/subscriptions',
        accessRole: ['admin', 'superAdmin'],
        hasGroup: false,
      },
      {
        title: 'Inventory',
        icon: 'assets/icons/notepad.svg',
        link: '/inventory',
        accessRole: ['admin', 'superAdmin'],
        hasGroup: false,
      },
      {
        title: 'Reports',
        icon: 'assets/icons/reports-icon.svg',
        link: '/reports',
        accessRole: ['admin', 'superAdmin'],
        hasGroup: true,
        isLinkActive: false,
        childs: [
          {
            title: 'Revenue',
            link: '/reports/revenue',
            accessRole: ['admin', 'superAdmin'],
            hasGroup: false,
          },
          {
            title: 'Data Usage',
            link: '/reports/data-usage',
            accessRole: ['admin', 'superAdmin'],
            hasGroup: false,
          },
          {
            title: 'Subscribers Reports',
            link: '/reports/subscriber',
            accessRole: ['admin', 'superAdmin'],
            hasGroup: false,
          },
          {
            title: 'Subscription Reports',
            link: '/reports/subscription',
            accessRole: ['admin', 'superAdmin'],
            hasGroup: false,
          },
        ],
      },
      {
        title: 'Loyalty Point Program',
        icon: 'assets/icons/fluent_reward-16-filled.svg',
        link: '/loyalty-point-program',
        accessRole: ['admin', 'superAdmin'],
        hasGroup: false,
      },
      {
        title: 'Coupon Management',
        icon: 'assets/icons/solar_ticket-sale-bold.svg',
        link: '/coupon-management',
        accessRole: ['admin', 'superAdmin'],
        hasGroup: false,
      },
      {
        title: 'Settings',
        icon: 'assets/icons/settings-icon.svg',
        link: '/setting',
        accessRole: ['admin', 'superAdmin'],
        hasGroup: false,
      },
      {
        title: 'Help Center',
        icon: 'assets/icons/headphone.svg',
        link: '/help-center',
        accessRole: ['admin', 'superAdmin'],
        hasGroup: true,
        isLinkActive: false,
        childs: [
          {
            title: 'Contact Us',
            link: '/help-center/contactus',
            accessRole: ['admin', 'superAdmin'],
            hasGroup: false,
          },
          {
            title: 'Support',
            link: '/help-center/support',
            accessRole: ['admin', 'superAdmin'],
            hasGroup: false,
          },
          // {
          //   title: 'Raise Ticket',
          //   link: 'https://support.glowingbud.com/',
          //   accessRole: ['admin','superAdmin'],
          //   hasGroup: false,
          //   external: true
          // }
        ],
      },
    ];
    return roles
      ? navMenuList.filter((nav) => roles.some((role) => nav.accessRole.includes(role)))
      : navMenuList;
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
