import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService, DialogService, UsersService, AlertService, DashboardService } from '../../service';
import { ConfirmComponent } from '../../dialog/confirm/confirm.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  isDarkTheme = false;
  defaultId:any;
  activeUrl = 'dashboard';
  show:boolean=false;
  customerList: any = [];
  parentCustomer:any;
  sidebarMenuList: Array<any> = [];
  userDetails: any = {};

  
  constructor(private router:Router,
              private customerService: CustomerService,
              private dashboardService: DashboardService,
              private usersService: UsersService,
              private alertService: AlertService,
              private dialogService: DialogService) { 

    router.events.subscribe(
      (data: any) => {
        this.activeUrl = this.router.url;
      }
    )

    dashboardService.getAppTheme().subscribe((data : any) =>{
      this.isDarkTheme = data;
    });
    usersService.getCurrentUser().subscribe(result => {
      this.userDetails = result;
      if(this.userDetails?.roles) {
        this.fetchNavBarMenuList(this.userDetails.roles)
      }
    });
  }
 

  ngOnInit(): void {
    if (!localStorage.getItem('authToken')) {
      this.router.navigate(['/signin']);
    }else{
      // this.getAllCustomer();
    }
  }

  fetchNavBarMenuList(roles: Array<string>){
    this.sidebarMenuList = this.dashboardService.getNavBarMenus(roles);
  }
  setDefaultCustomer(){
    this.dialogService.openModal(ConfirmComponent, { cssClass: 'modal-sm', context: {message: `Do you want to change to default customer?`} })
    .instance.close.subscribe((data: any) => {
      const vm = this;
      if (data) {
        this.usersService.setDefaultCustomer()
      .subscribe(
        (data: any) => {
          localStorage.setItem("authToken",data.token);
          window.location.href = '/';
        }, err => {
          this.alertService.error(err.error.message);
        });
      }
    });
  }



  getAllCustomer() {
    this.customerService.customers()
     .subscribe(
      (data: any) => {
      this.parentCustomer = data.name;       //parent customer name
      this.customerList = data.childCustomer; //anuyat under child
      }, err => {
        this.alertService.error(err.error.message);
      }
   );
  }

  customerSidebar(){
    // this.show=!this.show;
  }

  closeSidebar(){
    if(this.show === true){
      this.show = false;
    }
  }

  switchTocustomer(customerId: any){
    const currentCustomer =  {currentCustomerId: customerId}
    this.usersService.changeCurrentCustomer(currentCustomer)
    .subscribe((data:any)=>{
      localStorage.setItem("authToken",data.token);
        window.location.href = '/';
    }, err => {
      this.alertService.error(err.error.message);
    });
  }

  changeCustomer(customer: any) {
    this.dialogService.openModal(ConfirmComponent, { cssClass: 'modal-sm', context: {message: `Do you want to change to customer - ${customer.name}?`} })
    .instance.close.subscribe((data: any) => {
      const vm = this;
      if (data) {
        this.switchTocustomer(customer._id);
      }
      });
    }


    showSubmenu(itemEl: HTMLElement) {
      itemEl.classList.toggle("showMenu");
    }
  
}


