import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfirmComponent } from 'src/app/shared/dialog/confirm/confirm.component';
import { CustomerComponent } from 'src/app/shared/dialog/customer/customer.component';
import { CustomerService } from 'src/app/shared/service/customer.service';
import { DialogService } from 'src/app/shared/service/dialog';
import { UsersService } from 'src/app/shared/service/users.service';
import { AlertService } from 'src/app/shared/service/alert.service';

@Component({
  selector: 'app-customer-management',
  templateUrl: './customer-management.component.html',
  styleUrls: ['./customer-management.component.scss']
})
export class CustomerManagementComponent implements OnInit {
  customerList: any = [];
  customerId:any = null;
  currentCustomerId:any = null;
  subCustomerName : any = null;
  customer:any

  constructor(private customerService: CustomerService,
              private usersService: UsersService,
              private dialogService: DialogService,
              private route: ActivatedRoute,
              private alertService: AlertService) { }

  ngOnInit(): void {
    this.route.params
        .subscribe(params => {
          this.customerId = params['id']; 
          this.changeCurrentCustomer();
        });  
  }
  
  changeCurrentCustomer(){
        const currentCustomer =  {currentCustomerId: this.customerId}    //json
        this.usersService.changeCurrentCustomer(currentCustomer)
        .subscribe((data:any)=>{
          localStorage.setItem("authToken",data.token);
            if(this.customerId){
              this.getSingleCustomer();
            }
              this.getAllCustomer();
        }, err => {
          this.alertService.error(err.error.message);
        });
  }

  getSingleCustomer() {
        this.customerService.getSingleCustomer(this.customerId)
          .subscribe((data: any) => {
                this.customer = data;
          }, err => {
            this.alertService.error(err.error.message);
          });
  }

  getSubCustomer(){
    this.customerService.getSubCustomer(this.subCustomerName)
    .subscribe((data: any)=>{
       this.subCustomerName = data;
    },err => {
      this.alertService.error(err.error.message);
    });
  }

  createCustomer() {
     this.dialogService.openModal(CustomerComponent, { cssClass: 'modal-md', context: {data: {}, title: 'Add New Customer'} })
      .instance.close.subscribe((data: any) => {
        if (data && data.name != null ) {
          this.alertService.success('Customer Created');
          this.getAllCustomer();
        }
      });
  }

  getAllCustomer() {
    this.customerService.childCustomers()
     .subscribe(
      (data: any) => {
        this.customerList = data;
     }, err => {
      this.alertService.error(err.error.message);
      }
   );
  }

  editCustomer(index: number) {
    console.log(this.customerList[index]);
    this.dialogService.openModal(CustomerComponent, { cssClass: 'modal-md', context: {data: this.customerList[index], title: 'Edit Customer'} })
      .instance.close.subscribe((data: any) => {
        console.log(data);
        if(data){
          let vm  = this;
          vm.customerList[index] = data;
          this.alertService.success('Custommer Updated');
          this.getAllCustomer();
        }
        
    });
  }

  deleteCustomer( index: number) {
    this.dialogService.openModal(ConfirmComponent, { cssClass: 'modal-sm', context: {message: 'Are you sure want to delete this subscription?'} })
    .instance.close.subscribe((data: any) => {
      const vm = this;
      if (data) {
        vm.customerService.deleteCustomer(vm.customerList[index]._id)
        .subscribe(res => {
          vm.customerList.splice(index, 1);
        }, err => {
          this.alertService.error(err.error.message);
        })
      }
      });
  }

  selectCustomer(i:any){
    localStorage.setItem("customerId",this.customerList[i]._id);
  }
    
}
