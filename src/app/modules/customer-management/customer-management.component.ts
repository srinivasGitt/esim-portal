import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfirmComponent } from 'src/app/shared/dialog/confirm/confirm.component';
import { CustomerComponent } from 'src/app/shared/dialog/customer/customer.component';
import { CustomerService } from 'src/app/shared/service/customer.service';
import { DialogService } from 'src/app/shared/service/dialog';
import { UsersService } from 'src/app/shared/service/users.service';
import { AlertService } from 'src/app/shared/service/alert.service';
import { ImportProfileComponent } from 'src/app/shared/dialog/import-profile/import-profile.component';
import { AssignProfilesComponent } from 'src/app/shared/dialog/assign-profiles/assign-profiles.component';


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
  customer:any;
  monthsList: Array<string> = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  selectedFilter!: {month: number, year: number}; 
  p : number = 1;
  itemsPerPage: number= 5;
  totalProducts:any;

  constructor(private customerService: CustomerService,
              // private usersService: UsersService,
              private dialogService: DialogService,
              // private route: ActivatedRoute,
              private alertService: AlertService,
             
              )
               {}
  ngOnInit(): void {
    this.getAllCustomer();
    const date = new Date();
    this.selectedFilter = {
      month : date.getMonth(),
      year : date.getFullYear()
    }
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
        console.log(data)
        if (data && data.name !== null ) {
          let vm  = this;
          vm.customerList?.push(data);
          //this.alertService.success('Customer Created');
          this.getAllCustomer();
        }
      });
  }

  getAllCustomer() {
    this.customerService.customers()
     .subscribe(
      (data: any) => {
        this.customerList = data;
       this.totalProducts = data.length;
        console.log(data)
         }, err => {
      this.alertService.error(err.error.message);
      }
   );
   
   
  }

  editCustomer(index: number) {
    this.dialogService.openModal(CustomerComponent, { cssClass: 'modal-md', context: {data: this.customerList[index], title: 'Edit Customer'} })
      .instance.close.subscribe((data: any) => {
        if(data){
          console.log(data)
          let vm  = this;
          vm.customerList[index] = data;
          this.alertService.success('Custommer Updated');
          this.getAllCustomer();
        }
        
    });
  }

  deleteCustomer( index: number) {
    this.dialogService.openModal(ConfirmComponent, { cssClass: 'modal-sm', context: {message: 'Are you sure want to delete this customer?'} })
    .instance.close.subscribe((data: any) => {
      const vm = this;
      if (data) {
        vm.customerService.deleteCustomer(vm.customerList[index]._id)
        .subscribe(res => {
          vm.customerList.splice(index, 1);
          this.alertService.success('Customer Deleted');
        }, err => {
          this.alertService.error(err.error.message);
        })
      }
      });
  }

  selectCustomer(i:any){
    localStorage.setItem("customerId",this.customerList[i]._id);
  }

  importProfile(){
    this.dialogService.openModal(ImportProfileComponent, { cssClass: 'modal-md', context: {data: {}, title: 'Select File'} })
      .instance.close.subscribe(() => {
        
      });
  }

  assignProfiles(index: number){
    this.dialogService.openModal(AssignProfilesComponent, {cssClass: 'modal-md', context: {data: this.customerList[index], title: 'Assign Profiles'}})
    .instance.close.subscribe((data: any) => {
        if(data){
          this.customerList[index] = data;
          this.alertService.success('Profiles assigned successfully');
          this.getAllCustomer();
        }
    });
  }

  addNewCustomer() {
       
    
    
   
  }





















    
}






