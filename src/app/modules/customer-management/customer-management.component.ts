import { Component, OnInit } from '@angular/core';
import { ConfirmComponent } from 'src/app/shared/dialog/confirm/confirm.component';
import { CustomerComponent } from 'src/app/shared/dialog/customer/customer.component';
import { CustomerService } from 'src/app/shared/service/customer.service';
import { DialogService } from 'src/app/shared/service/dialog';
import { AlertService } from 'src/app/shared/service/alert.service';
import { ImportProfileComponent } from 'src/app/shared/dialog/import-profile/import-profile.component';
import { AssignProfilesComponent } from 'src/app/shared/dialog/assign-profiles/assign-profiles.component';
import { PaginationInstance } from 'ngx-pagination';
import { FormControl, FormGroup } from '@angular/forms';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

@Component({
  selector: 'app-customer-management',
  templateUrl: './customer-management.component.html',
  styleUrls: ['./customer-management.component.scss'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'en-IN'},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ]
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
  currentMonth!: number;
  paginateConfig: PaginationInstance = {
    id: 'customerListPagination',
    itemsPerPage: 20,
    currentPage: 1
  };
  filterConfig: any = {
    searchTerm: '',
    searchKey: 'name',
    filterBy: { key : 'createdAt', type: 'date', value: undefined }
  };
  inProgress: boolean = false;
  customForm: any;
  selectedDay: string = 'Current Year'
  selectedDayTerm: string = '';
  isCustomRange: boolean = false;
  startDate!: string;
  endDate!: string;
  currentDate = new Date().toISOString().slice(0, 10);

  constructor(private customerService: CustomerService,
              private dialogService: DialogService,
              private alertService: AlertService,
              ){}

  ngOnInit(): void {
    this.initForm();
    this.getAllCustomer();
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
     this.dialogService.openModal(CustomerComponent, { cssClass: 'modal-sm', context: {data: {}, title: 'Add New Customer'} })
      .instance.close.subscribe((data: any) => {
        if (data && data.name !== null ) {
          let vm  = this;
          vm.customerList?.push(data);
          this.alertService.success(data.message);
          this.getAllCustomer();
        }
      });
  }

  getAllCustomer() {
    this.inProgress = true;
    this.customerService.customers().subscribe(
      (res: any) => {
        if(res) {
          this.customerList = res.data;
          this.paginateConfig.totalItems = res?.count[0]?.totalCount;
          this.inProgress = false;
        }
      }, err => {
        this.alertService.error(err.error.message, err.status);
        this.inProgress = false;
      }); 
  }

  editCustomer(customer: any) {
    this.dialogService.openModal(CustomerComponent, { cssClass: 'modal-sm', context: {data: customer, title: 'Edit Customer'} })
      .instance.close.subscribe((data: any) => {
        if(data){
          this.customerList = this.customerList.map((c : any) => {if(c._id == customer._id) c = data; return c;});
          this.alertService.success(data.message);
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
        .subscribe((res: any) => {
          this.customerList = this.customerList.filter((c : any) => c._id != customer._id);
          this.alertService.success(res.message);
        }, err => {
          this.alertService.error(err.error.message, err.status);
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

  searchRecord(searchTerm ?: any){
    if(searchTerm?.length > 2){
      this.filterConfig.searchTerm = searchTerm;
    } else {
      this.filterConfig.searchTerm = "";
    }
  }

  initForm(): void {
    this.customForm = new FormGroup({
      fromDate: new FormControl<Date | null>(null),
      toDate: new FormControl<Date | null>(null),
    });
  }

  get f() { return this.customForm.controls; }
  

  getPageNumber(event: any) {
    this.inProgress = true;
    this.paginateConfig.currentPage = event; 

    /* Pagination based on Filter */
    if(this.selectedDayTerm) {
      this.getAllCustomers(this.selectedDayTerm, this.startDate, this.endDate)
    }
    /* Pagination based on all data */
    else {
      this.customerService.customers(this.paginateConfig.itemsPerPage, this.paginateConfig.currentPage-1)
      .subscribe(
        (res: any) => {
          this.customerList = res.data;
          this.paginateConfig.totalItems = res?.count[0]?.totalCount;
          this.inProgress = false;
        }, err => {
          this.alertService.error(err.error.message, err.status);
          this.inProgress = false;
        }
      );
    }
  }

  /* Get Customers based on Filter - Start */
  selectTimeframe(value: any) {
    this.selectedDayTerm = value;
    this.getAllCustomers(this.selectedDayTerm);
    this.paginateConfig.currentPage = 1;
    this.customForm?.reset();
  }
  /* Get Customers based on Filter - End */

  dateRangeChange(dateRangeStart: HTMLInputElement, dateRangeEnd: HTMLInputElement) {
    if(!this.customForm.valid) {
      return
    }

    this.startDate = dateRangeStart.value
    this.endDate = dateRangeEnd.value
    this.selectedDayTerm = 'custom'
    this.inProgress = true;
    setTimeout( ()=>{
      this.getAllCustomers(this.selectedDayTerm, this.startDate, this.endDate)
    }, 1000)
    
    this.paginateConfig.currentPage = 1;
  }

  /* Get filtered data - Start */
  getAllCustomers(value?: any, fromDate?: any, toDate?: any) {
    this.inProgress = true;
    this.customerService.getFilteredCustomersList(value, fromDate, toDate,this.paginateConfig.itemsPerPage, this.paginateConfig.currentPage-1).subscribe((res: any) => {
      if(res) {
        this.customerList = res.data;
        this.paginateConfig.totalItems = res?.count[0]?.totalCount;
        this.inProgress = false;
      }
    }, err => {
      this.alertService.error(err.error.message);
      this.inProgress = false;
    })
  }
  /* Get filtered data - End */

}
