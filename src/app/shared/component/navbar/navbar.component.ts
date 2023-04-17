import { Component, OnInit } from '@angular/core';
import { CustomerService, UsersService, AlertService, DashboardService } from '../../service';
import { NavigationEnd, Router } from '@angular/router';
import { LocalStorageService } from '../../service/local-storage.service';
declare var $: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isDarkTheme = false;
  screenMode:any;
  parentCustomer: any;
  customerList: any = [];
  userDetails: any;
  showSearch: boolean = true;

  constructor(private customerService: CustomerService,
              private dashboardService: DashboardService,
              private alertService : AlertService,
              private usersService: UsersService,
              public router: Router,
              private _localStorage: LocalStorageService) {
    
      // show/hide search box
      router.events.subscribe((route) => {
      if(route instanceof NavigationEnd) {
        if(route.url == "/" || route.url == "/reports") {
          this.showSearch = false;
        } else {
          this.showSearch = true;
        }
      }
    })
    usersService.getCurrentUser().subscribe(result => {
      this.userDetails = result;
    });
  }

  ngOnInit(): void { 
    
    if (!this._localStorage.getToken()) {
      this.router.navigate(['/signin']);
    }else{
      // this.getAllCustomer();
    }
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    this.dashboardService.setAppTheme(this.isDarkTheme);
    this._localStorage.setTheme(this.isDarkTheme)
    $('#body').toggleClass('lightMode');
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

  signout(){
    this._localStorage.removeToken()
  }

}
