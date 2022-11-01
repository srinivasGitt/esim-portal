import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfirmComponent } from 'src/app/shared/dialog/confirm/confirm.component';
import { CustomerComponent } from 'src/app/shared/dialog/customer/customer.component';
import { SubscriptionDialogComponent } from 'src/app/shared/dialog/subscription/subscription.component';
import { CustomerService } from 'src/app/shared/service/customer.service';
import { DialogService } from 'src/app/shared/service/dialog';

@Component({
  selector: 'app-customer-management',
  templateUrl: './customer-management.component.html',
  styleUrls: ['./customer-management.component.scss']
})
export class CustomerManagementComponent implements OnInit {
  customerList: any = [];
  customerId:any = null;
  customer:any

  constructor(private customerService: CustomerService,
              private dialogService: DialogService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.route.params
        .subscribe(params => {
          console.log(params);
          this.customerId = params['id']; 
          if(this.customerId){
            this.getSingleCustomer();
          }
          this.getAllCustomer();
        });  
  }

  getSingleCustomer() {
        this.customerService.getSingleCustomer(this.customerId)
          .subscribe((data: any) => {
                console.log(data);
                this.customer = data;
          }, err => {
            console.log(err);
          });
  }

  createCustomer() {
     this.dialogService.openModal(CustomerComponent, { cssClass: 'modal-md', context: {data: {}, title: 'Add New Customer'} })
      .instance.close.subscribe((data: any) => {
        console.log(data);
        if (data) {
          const customer= {
            name: data.customerName,
            parentId: this.customerId,
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
    this.customerService.customerList(this.customerId)
     .subscribe(
      (data: any) => {
      console.log(data);
      this.customerList = data;
     }, err => {
        console.log(err);
      }
   );
  }

  editCustomer(index: number) {
    this.dialogService.openModal(CustomerComponent, { cssClass: 'modal-md', context: {data: this.customerList[index], title: 'Edit Subscription'} })
      .instance.close.subscribe((data: any) => {
        let vm  = this;
        vm.customerService.updateCustomer(vm.customerList[index]._id, data)
        .subscribe( (res: any) => {
          vm.customerList[index] = res;
        }, err => {
          console.log(err);
        })
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
          console.log(err);
        })
      }
      console.log(data);
      });
  }
  selectCustomer(i:any){
    console.log(this.customerList[i]._id);
    localStorage.setItem("customerId",this.customerList[i]._id);
  }
    
}
