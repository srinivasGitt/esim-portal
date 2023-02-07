import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../service/customer.service';
import { AlertService } from '../../service/alert.service';
import { Router } from '@angular/router';
import { DashboardService } from '../../service/dashboard.service';
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

  constructor(private customerService: CustomerService,
              private dashboardService: DashboardService,
              private alertService : AlertService,
              private router: Router) { }

  ngOnInit(): void { 
    if (!localStorage.getItem('authToken')) {
      this.router.navigate(['/signin']);
    }else{
      this.getAllCustomer();
    }
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    this.dashboardService.setAppTheme(this.isDarkTheme);
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
    localStorage.removeItem('authToken');
    this.router.navigate(['/signin']);
  }
 
}
