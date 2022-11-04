import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from '../../service/customer.service';
import { AlertService } from '../../service/alert.service';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  activeUrl = 'dashboard';
  show:boolean=false;
  customerList: any = [];
  
  constructor(private router:Router,
              private customerService: CustomerService,
              private alertService: AlertService) { 

    router.events.subscribe(
      (data: any) => {
        this.activeUrl = this.router.url;
      }
    )
  }
 

  ngOnInit(): void {
    this.getAllCustomer();
    
  }
  getAllCustomer() {
    this.customerService.customerList()
     .subscribe(
      (data: any) => {
        this.customerList = data;
     }, err => {
        this.alertService.error(err.error.message);
      }
   );
  }

  customerSidebar(){
    this.show=!this.show;
  }

  

}
