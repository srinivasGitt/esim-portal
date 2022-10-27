import { Component, OnInit } from '@angular/core';
import { CustomerComponent } from 'src/app/shared/dialog/customer/customer.component';
import { CustomerService } from 'src/app/shared/service/customer.service';
import { DialogService } from 'src/app/shared/service/dialog';

@Component({
  selector: 'app-customer-management',
  templateUrl: './customer-management.component.html',
  styleUrls: ['./customer-management.component.scss']
})
export class CustomerManagementComponent implements OnInit {
  customerList: any = [];
  constructor(private customerService: CustomerService,
    private dialogService: DialogService) { }

  ngOnInit(): void {
    this.getAllCustomer();
  }
  

  createCustomer() {
     this.dialogService.openModal(CustomerComponent, { cssClass: 'modal-md', context: {data: {}, title: 'Add New Customer'} })
      .instance.close.subscribe((data: any) => {
        console.log(data);
        if (data) {
          const customer= {
            name: data.customerName,
            parentId: null,
          };
          let vm  = this;
          vm.customerService.createCustomer(customer)
          .subscribe( (res: any) => {
            console.log(res);
            this.getAllCustomer();
          }, err => {
            console.log(err);
          })
          // this.getAllCustomer();
        }
        });
  }

  getAllCustomer() {
    this.customerService.customerList()
     .subscribe(
      (data: any) => {
      console.log(data);
      this.customerList = data;
     }, err => {
        console.log(err);
      }
   );
  }

  selectCustomer(i:any){
    console.log(this.customerList[i]._id);
    localStorage.setItem("customerId",this.customerList[i]._id);
  }
    
}
