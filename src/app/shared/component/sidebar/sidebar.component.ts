import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ConfirmComponent } from '../../dialog/confirm/confirm.component';
import {
  AlertService,
  CustomerService,
  DashboardService,
  DialogService,
  UsersService,
} from '../../service';
import { ConfigurationService } from '../../service/configuration.service';
import { LocalStorageService } from '../../service/local-storage.service';
import { SidebarService } from '../../service/sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  isDarkTheme = false;
  defaultId: any;
  activeUrl = 'dashboard';
  show: boolean = false;
  customerList: any = [];
  parentCustomer: any;
  sidebarMenuList: Array<any> = [];
  userDetails: any = {};
  isParentActive: any;
  clientConfig!: any;
  routeConfig: any;
  isCustomerSelected = false;
  isRole: any;
  adminMenuList: any = [];
  superAdminMenuList: any = [];
  selectedCustomerList: any = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private customerService: CustomerService,
    private dashboardService: DashboardService,
    private sidebarService: SidebarService,
    private usersService: UsersService,
    private alertService: AlertService,
    private dialogService: DialogService,
    private localStorage: LocalStorageService,
    private configurationService: ConfigurationService,
  ) {
    router.events.subscribe((data: any) => {
      if (data instanceof NavigationEnd) {
        const childRoute = this.activatedRoute.firstChild?.snapshot;
        this.routeConfig = this.activatedRoute.firstChild?.routeConfig?.children;

        if (childRoute && this.routeConfig) {
          const isChildActive = data.urlAfterRedirects.includes(childRoute.url.join('/'));
          this.isParentActive = isChildActive;
        } else {
          this.isParentActive = false;
        }
      }
      this.activeUrl = this.router.url;
    });

    dashboardService.getAppTheme().subscribe((data: any) => {
      this.isDarkTheme = data;
    });

    usersService.getCurrentUser().subscribe((result) => {
      this.userDetails = result;
      if (this.userDetails?.roles) {
        this.isRole = this.userDetails?.roles;
        this.fetchSideBarMenuList();
      }
    });
  }

  ngOnInit(): void {
    if (!localStorage.getItem('authToken')) {
      this.router.navigate(['/signin']);
    } else {
      this.clientConfig = JSON.parse(this.localStorage.getCacheConfig()!);
    }

    console.log(this.localStorage.getSelectedCustomer());
    this.isCustomerSelected = !this.localStorage.getSelectedCustomer() || this.localStorage.getSelectedCustomer() === 'false' ? false : true;

    this.customerService.getCustomer()
      .subscribe(res => {
        if(res) {
          this.isCustomerSelected = true;
          this.selectedCustomerList = res;
          console.log(this.selectedCustomerList);
        } else {
          this.isCustomerSelected = false;
          this.selectedCustomerList = [];
        }
      });
      this.getCustomerHierarchy();
  }

  async fetchSideBarMenuList(roles?: Array<string>) {
    this.usersService.inProgress.next(true);
    
    if (roles && !roles.includes('superAdmin')) {
      await this.getClientConfiguration();
    }

    let menuList = this.sidebarService.getSideBarMenus();

    if (this.clientConfig) {
      if (!this.clientConfig?.rewardPointsMasterEnabled) {
        menuList = menuList.filter((menu) => !(menu.title == 'Loyalty Point Program'));
      }

      if (!this.clientConfig?.couponCodesMasterEnabled) {
        menuList = menuList.filter((menu) => !(menu.title == 'Coupon Management'));
      }
    }

    this.sidebarMenuList = menuList;

    this.superAdminMenuList = this.sidebarMenuList.filter(ele => ele.accessRole.includes('superAdmin'));
    this.adminMenuList = this.sidebarMenuList.filter(ele => ele.accessRole.includes('admin'));

    this.usersService.inProgress.next(false);
  }

  getCustomerHierarchy() {
    this.customerService.getCustomerHierachy()
      .subscribe((res: any) => {
        console.log(res);
        this.customerList = res;
      }, err => {

      })
  }

  // Client Feature Configuration
  getClientConfiguration() {
    const clientConfig = JSON.parse(localStorage.getItem('config')!);

    return new Promise((resolve, reject) => {
      this.configurationService.getConfigurationSetting(clientConfig?.cacheId).subscribe(
        (res: any) => {
          if (res && res.data) {
            this.clientConfig = res.data;
            this.localStorage.setCacheConfig(JSON.stringify(res.data));
          }
          resolve(true);
        },
        (err: any) => {
          this.alertService.error(err.error.message, err.status);
          reject(err);
        }
      );
    });
  }

  setDefaultCustomer() {
    this.dialogService
      .openModal(ConfirmComponent, {
        cssClass: 'modal-sm',
        context: { message: `Do you want to change to default customer?` },
      })
      .instance.close.subscribe((data: any) => {
        const vm = this;
        if (data) {
          this.usersService.setDefaultCustomer().subscribe(
            (data: any) => {
              localStorage.setItem('authToken', data.token);
              window.location.href = '/';
            },
            (err) => {
              this.alertService.error(err.error.message);
            }
          );
        }
      });
  }

  getAllCustomer() {
    this.customerService.customers().subscribe(
      (data: any) => {
        this.parentCustomer = data.name; //parent customer name
        this.customerList = data.childCustomer; //anuyat under child
      },
      (err) => {
        this.alertService.error(err.error.message);
      }
    );
  }

  closeSidebar() {
    if (this.show === true) {
      this.show = false;
    }
  }

  switchTocustomer(customerId: any) {
    const currentCustomer = { currentCustomerId: customerId };
    this.usersService.changeCurrentCustomer(currentCustomer).subscribe(
      (data: any) => {
        localStorage.setItem('authToken', data.token);
        window.location.href = '/';
      },
      (err) => {
        this.alertService.error(err.error.message);
      }
    );
  }

  changeCustomer(customer: any) {
    this.dialogService
      .openModal(ConfirmComponent, {
        cssClass: 'modal-sm',
        context: { message: `Do you want to change to customer - ${customer.name}?` },
      })
      .instance.close.subscribe((data: any) => {
        const vm = this;
        if (data) {
          this.switchTocustomer(customer._id);
        }
      });
  }

  showSubmenu(itemEl: HTMLElement, title: any) {
    itemEl.classList.toggle('showMenu');
  }

  findUrl(menu: any) {
    return menu.childs.findIndex((ele: any) => ele.link === window.location.pathname) > -1
      ? true
      : false;
  }

  clearCustomerSelection() {
    this.isCustomerSelected = false;
    this.localStorage.setSelectedCustomer(String(false));
    this.customerService.sendCustomer(false);
  }
}
