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
import { PaginationInstance } from 'ngx-pagination';


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
  currentYear!: number;
  paginateConfig: PaginationInstance = {
    id: 'customerListPagination',
    itemsPerPage: 20,
    currentPage: 1,
    totalItems: 0
  };

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
    };
    this.currentYear = date.getFullYear();

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
        this.paginateConfig.totalItems = parseInt(data.length);
      }, err => {
      this.alertService.error(err.error.message);
      }
   );
   
   
  }

  editCustomer(customer: any) {
    this.dialogService.openModal(CustomerComponent, { cssClass: 'modal-md', context: {data: customer, title: 'Edit Customer'} })
      .instance.close.subscribe((data: any) => {
        if(data){
          this.customerList = this.customerList.map((c : any) => {if(c._id == customer._id) c = data; return c;});
          this.alertService.success('Custommer Updated');
          this.getAllCustomer();
        }
        
    });
  }

  deleteCustomer( customer: any) {
    let data = {
      title: 'Delete Customer?',
      icon: 'trash',
      showCloseBtn: true,
      buttonGroup: [
        { cssClass: 'btn-danger-scondary', title: 'Cancel', value: false},
        { cssClass: 'btn-danger ms-auto', title: 'Delete', value: true}
      ]
    };
    this.dialogService.openModal(ConfirmComponent, { cssClass: 'modal-sm', context: {message: 'Are you sure you want to delete this customer? This action cannot be undone.', data} })
    .instance.close.subscribe((data: any) => {
      if (data) {
        this.customerService.deleteCustomer(customer._id)
        .subscribe(res => {
          this.customerList = this.customerList.filter((c : any) => c._id != customer._id);
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






