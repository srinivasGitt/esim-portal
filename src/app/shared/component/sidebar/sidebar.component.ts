import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CustomerService } from '../../service/customer.service';
import { DialogService } from '../../service/dialog';
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
              private customerService: CustomerService) { 

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
    this.customerService.customerList(null)
     .subscribe(
      (data: any) => {
    
      this.customerList = data;
     }, err => {
        console.log(err);
      }
   );
  }

  customerSidebar(){
    this.show=!this.show;
  }

  

}
