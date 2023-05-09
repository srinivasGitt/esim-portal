import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Subject } from 'rxjs';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  serverUrl = environment.serverUrl;
  private _themeSelection$ = new BehaviorSubject<any>(undefined);
  
  constructor(private http : HttpClient, private _localStorage: LocalStorageService) { }

  /*
   ************************************
  Commented to check with interceptor
  ************************************
  getHeader() {
    const authToken = localStorage.getItem('authToken');
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      })
    };
    return httpOptions;
  }
*/

  setAppTheme(theme : any){
    this._themeSelection$.next(theme);
  }
  
  getAppTheme(){
    return this._themeSelection$.asObservable();
  }

  getNavBarMenus(roles : Array<string>){
    let navMenuList = [
      {
        title: 'Dashboard',
        icon: 'assets/icons/dashboard-icon.svg',
        link: '/',
        accessRole: ['admin','superAdmin'],
        hasGroup: false
      },
      {
        title: 'Customers',
        icon: 'assets/icons/customer-icon.svg',
        link: '/customer-management',
        accessRole: ['superAdmin'],
        hasGroup: false
      },
      {
        title: 'User Management',
        icon: 'assets/icons/manage_accounts.svg',
        link: '/user-management',
        accessRole: ['admin','superAdmin'],
        hasGroup: false
      },
      {
        title: 'Plans',
        icon: 'assets/icons/plans-icon.svg',
        link: '/plans',
        accessRole: ['admin','superAdmin'],
        hasGroup: false
      },
      {
        title: 'Subscribers',
        icon: 'assets/icons/subscriber-icon.svg',
        link: '/subscribers',
        accessRole: ['admin','superAdmin'],
        hasGroup: false
      },
      {
        title: 'Subscriptions',
        icon: 'assets/icons/subscription-icon.svg',
        link: '/subscriptions',
        accessRole: ['admin','superAdmin'],
        hasGroup: false
      },
      {
        title: 'Inventory',
        icon: 'assets/icons/notepad.svg',
        link: '/inventory',
        accessRole: ['admin','superAdmin'],
        hasGroup: false
      },
      {
        title: 'Reports',
        icon: 'assets/icons/reports-icon.svg',
        link: '/reports',
        accessRole: ['admin','superAdmin'],
        hasGroup: false
      },
      {
        title: 'Settings',
        icon: 'assets/icons/settings-icon.svg',
        link: '/settings',
        accessRole: ['admin','superAdmin'],
        hasGroup: false,
        isDisabled: true
      },
    ];
    return roles ? navMenuList.filter((nav) => roles.some(role => nav.accessRole.includes(role))) : navMenuList;
  }

  getDashboardWidgets(){
    return [
      {
        title: 'Total Revenue',
        titleIcon: '/assets/images/dashboard/widgets-icon/users-icon.svg',
        detailsType: 'currency',
        detailsKey: 'revenue',
        graphIcon: '/assets/images/dashboard/widgets-icon/graph-1.svg',
        showFooter: true,
        increase: 10
      },
      {
        title: 'Total Subscribers',
        titleIcon: '/assets/images/dashboard/widgets-icon/users-icon.svg',
        detailsType: '',
        detailsKey: 'subscriberCount',
        graphIcon: '/assets/images/dashboard/widgets-icon/graph-2.svg',
        showFooter: true,
        increase: 5
      },
      {
        title: 'Total Subscriptions',
        titleIcon: '/assets/images/dashboard/widgets-icon/checkmark-icon.svg',
        detailsType: '',
        detailsKey: 'subscriptionCount',
        graphIcon: '/assets/images/dashboard/widgets-icon/graph-3.svg',
        showFooter: true,
        increase: 5
      },
      {
        title: 'Active Plans',
        titleIcon: '/assets/images/dashboard/widgets-icon/plan-icon.svg',
        detailsType: '',
        detailsKey: 'planCount',
        graphIcon: '',
        showFooter: false,
        increase: 2
      }
    ]
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

  getProfiles(){
    return this.http.get(`${this.serverUrl}/dashboard`);
  }

  getDashboardCounts(){
    return [
      this.http.get(`${this.serverUrl}/subscriptions/totalRevenue`),
      this.http.get(`${this.serverUrl}/subscriptions/count`),
      this.http.get(`${this.serverUrl}/subscribers/count`),
      this.http.get(`${this.serverUrl}/plans/count`)
    ];
  }

  getReports(dateRangeValue?: string) {
    if(dateRangeValue) {
      return this.http.get(`${this.serverUrl}/subscriptions/revenue/graph?dateRange=${dateRangeValue}`)
    }
    else {
      return this.http.get(`${this.serverUrl}/subscriptions/revenue/graph?dateRange=year`)
    }
  }
}
