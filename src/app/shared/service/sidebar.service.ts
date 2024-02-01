import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  constructor() { }

  getSideBarMenus(roles: Array<string>) {
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
}
