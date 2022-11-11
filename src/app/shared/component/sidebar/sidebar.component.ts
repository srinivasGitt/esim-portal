import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CustomerService } from '../../service/customer.service';
import { DialogComponent, DialogService } from '../../service/dialog';
import { UsersService } from '../../service/users.service';
import { AlertService } from '../../service/alert.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  defaultId:any;
  activeUrl = 'dashboard';
  show:boolean=false;
  customerList: any = [];
  parentCustomer:any;

  
  constructor(private router:Router,
              private customerService: CustomerService,
              private usersService: UsersService,
              private dialogService: DialogService, 
              private alertService: AlertService,) { 

    router.events.subscribe(
      (data: any) => {
        this.activeUrl = this.router.url;
      }
    )
  }
 

  ngOnInit(): void {
    this.getAllCustomer();
    
  }

  setDefaultCustomer(){
    this.usersService.setDefaultCustomer()
     .subscribe(
      (data: any) => {
        localStorage.setItem("authToken",data.token);
        this.getAllCustomer();
        this.router.navigate(['/customer-management']);
      }, err => {
        this.alertService.error(err.error.message);
      }
   )
  }



  getAllCustomer() {
    this.customerService.customerList('')
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
    this.show=!this.show;
  }

  // close(): void {
  //   this.dialogRef.close.emit(this.customerForm.value);
  // }
  
}


