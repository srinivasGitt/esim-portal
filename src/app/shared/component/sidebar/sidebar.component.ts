import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CustomerService } from '../../service/customer.service';
import { DialogComponent, DialogService } from '../../service/dialog';
import { UsersService } from '../../service/users.service';
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
  
  constructor(private router:Router,
              private customerService: CustomerService,
              private usersService: UsersService,
              private dialogService: DialogService,) {
              

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
      }, err => {
        console.log(err);
      }
   );
  }



  getAllCustomer() {
    this.customerService.customerList(null)
     .subscribe(
      (data: any) => {
      console.log(data);
      this.customerList = data.childCustomer;
     }, err => {
        console.log(err);
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


