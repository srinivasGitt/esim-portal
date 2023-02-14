import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  serverUrl = environment.serverUrl;
  private _themeSelection$ = new Subject<any>();
  
  constructor(private http : HttpClient) { }

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

  getProfiles(){
    return this.http.get(`${this.serverUrl}/dashboard`, this.getHeader());
  }

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
        hasGroup: true
      },
      {
        title: 'Subscribers',
        icon: 'assets/icons/subscriber-icon.svg',
        link: '/subscriber',
        accessRole: ['admin','superAdmin'],
        hasGroup: true
      },
      {
        title: 'Subscriptions',
        icon: 'assets/icons/subscription-icon.svg',
        link: '/subscriptions',
        accessRole: ['admin','superAdmin'],
        hasGroup: true
      },
      {
        title: 'Reports',
        icon: 'assets/icons/reports-icon.svg',
        link: '/reports',
        accessRole: ['admin','superAdmin'],
        hasGroup: true
      },
      {
        title: 'Settings',
        icon: 'assets/icons/settings-icon.svg',
        link: '/settings',
        accessRole: ['admin','superAdmin'],
        hasGroup: false
      },
    ];
    return navMenuList.filter((nav) => roles.some(role => nav.accessRole.includes(role)));
  }
}
