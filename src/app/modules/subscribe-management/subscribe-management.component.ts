import { Component, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfirmComponent } from 'src/app/shared/dialog/confirm/confirm.component';
import { SubscriberMgmtComponent } from 'src/app/shared/dialog/subscriber-mgmt/subscriber-mgmt.component';
import { DialogService } from 'src/app/shared/service/dialog';
import { PlansService } from 'src/app/shared/service/plans.service';
import { RegionsService } from 'src/app/shared/service/regions.service';
import { subscriberService } from 'src/app/shared/service/subscriber.service';
import { AlertService } from 'src/app/shared/service/alert.service';
import { SubscriberInfoComponent } from 'src/app/shared/dialog';
import { PaginationInstance } from 'ngx-pagination';
import { SearchService } from 'src/app/shared/service/search/search.service';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {FormGroup, FormControl} from '@angular/forms';

const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};


@Component({
  selector: 'app-subscribe-management',
  templateUrl: './subscribe-management.component.html',
  styleUrls: ['./subscribe-management.component.scss'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'en-IN'},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    // {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class SubscribeManagementComponent implements OnInit, OnDestroy {
  subscriberList:any;
  regionList: any = [];
  planList: any = [];
  paginateConfig: PaginationInstance = {
    id: 'subscriberListPagination',
    itemsPerPage: 20,
    currentPage: 1,
    totalItems: 0
  };
  filterConfig: any = {
    searchTerm: '',
    searchKey: 'displayName',
    filterBy: undefined
  };
  inProgress: boolean = false;
  inSearch : boolean = false;
  copyText: string = 'Copy'
  customForm: any;
  selectedDay: string = 'Current Year'
  selectedDayTerm: string = '';
  isCustomRange: boolean = false;
  startDate!: string;
  endDate!: string;
  currentDate = new Date().toISOString().slice(0, 10);

  constructor( private dialogService: DialogService,
              private subscriberService: subscriberService,
              private regionService: RegionsService,
              private planService: PlansService,
              private route: ActivatedRoute,
              private alertService: AlertService,
              private _searchService: SearchService,
              private renderer: Renderer2, 
              private elementRef: ElementRef) {
                _searchService.getResults().subscribe((results: any) => {
                  if(results) {
                    this.subscriberList = results?.data
                    this.paginateConfig.totalItems = results?.count[0]?.totalCount;
                    this.paginateConfig.currentPage = 1;
                    this.inSearch = true;
                    this.isCustomRange = false;
                    this.selectedDayTerm = 'year';
                    this.selectedDay = 'Current Year';
                    this.customForm?.reset();
                  }
                }) 
              }

  ngOnInit(): void {
    this.initForm();
    this.getAllSubscriber();
    
  }

  getAllRegions(): void {
    this.regionService.getAllRegions()
    .subscribe(
      res => {
        this.regionList = res;
        this.subscriberList.forEach((element: any) => {
          const tRegion = this.regionList.find((o: any) => o._id === element.regionId);
          if (tRegion) {
            element.region = tRegion.name;
          }
        });
      }, err => {
        this.alertService.error(err.error.message);
      }
    )
  }
  
  getAllPlans(): void {
    this.planService.listPlans()
    .subscribe(
      res => {
        this.planList = res;
        this.subscriberList.forEach((element: any) => {
          const tRegion = this.planList.find((o: any) => o._id === element.planId);
          if (tRegion) {
            element.planName = tRegion.name;
          }
        });
      }, err => {
        this.alertService.error(err.error.message);
      }
    )
  }

  createSubscriber() {
    this.dialogService.openModal(SubscriberMgmtComponent, { cssClass: 'modal-md', context: {data: {}, title: 'Add New Subscriber'} })
      .instance.close.subscribe((data: any) => {
        if (data) {
          this.alertService.success('Subscriber Created');
          this.paginateConfig.currentPage = 1;
          this.getAllSubscriber();
        }
        });
  }

  getAllSubscriber() {
    this.inProgress = true;

    this.subscriberService.getAllSubscriber()
    .subscribe(
      (res: any) => {
        this.subscriberList = res.data;
        this.paginateConfig.totalItems = res?.count[0]?.totalCount;
        // this.getAllRegions();
        // this.getAllPlans();
        // this.subscriptionList = data;
        this.inProgress = false;
      }, err => {
        this.alertService.error(err.error.message, err.status);
        this.inProgress = false;
      }
    );

  }
  
  editSubscriber(index: number) {
    this.dialogService.openModal(SubscriberMgmtComponent, { cssClass: 'modal-md', context: {data: this.subscriberList[index], title: 'Edit Subscriber'} })
      .instance.close.subscribe((data: any) => {
        if(data){
          let vm  = this;
          vm.subscriberList[index] = data.data;
          this.alertService.success('Subscriber Updated');
          this.paginateConfig.currentPage = 1;
          this.getAllSubscriber();
        }
      });
  }

  deleteSubscriber( subscriber: any) {
    let data = {
      title: `Delete Subscriber, ${subscriber.firstName}?`,
      icon: 'trash',
      showCloseBtn: true,
      buttonGroup: [
        { cssClass: 'btn-danger-scondary', title: 'Cancel', value: false},
        { cssClass: 'btn-danger ms-auto', title: 'Delete', value: true}
      ]
    };
    this.dialogService.openModal(ConfirmComponent, { cssClass: 'modal-sm', context: {message: 'Are you sure you want to delete this subscriber? This action cannot be undone.', data} })
    .instance.close.subscribe((data: any) => {
      const vm = this;
      if (data) {
        vm.subscriberService.deleteSubscriber(subscriber._id)
        .subscribe((res: any) => {
          this.subscriberList = this.subscriberList.filter((s : any) => s._id != subscriber._id);
          this.alertService.success(res.message);
          this.paginateConfig.currentPage = 1;
          this.getAllSubscriber();
        }, err => {
          this.alertService.error(err.error.message, err.status);
        })
      }
      });
    }

  showSubscriber(subscriber: any){
    this.dialogService.openModal( SubscriberInfoComponent, { cssClass: 'modal-sm', context: {data: subscriber} })
    .instance.close.subscribe((data: any) => {
      
    }, err => {

    })
  }

  searchRecord(searchTerm ?: any){
    if(searchTerm?.length > 2){
      this.filterConfig.searchTerm = searchTerm;
    } else {
      this.filterConfig.searchTerm = "";
    }
  }

  // SubscriberInvite(){
  //   this.dialogService.openModal(InviteSubscriberComponent, { cssClass: 'modal-md', context: {data: {}, title: 'Invite User'} })
  //   .instance.close.subscribe((data: any) => {
  //     console.log(data);
  //     // if (data) {
  //     //   let vm  = this;
  //     //   this.getAllUsers();
  //     //   // vm.usersList.push(data);
  //     // }
  //     });
  // }

  getPageNumber(event: any) {
    this.inProgress = true;
    this.paginateConfig.currentPage = event; 

    /* Pagination based on searched data */
    if(this.inSearch && this._searchService.searchedTerm.length > 3) {
      this.isCustomRange = false;
      this.selectedDayTerm = 'year'
      this.selectedDay = 'Current Year'
      this._searchService.getSearchResult('/subscribers', this._searchService.searchedTerm,this.paginateConfig.itemsPerPage, this.paginateConfig.currentPage-1).subscribe((result: any) => {
        this.subscriberList = result.data;
        this.paginateConfig.totalItems = result?.count[0]?.totalCount;
        this.inProgress = false;
      })
    } 
    /* Pagination based on Filter */
    else if(this.selectedDayTerm) {
      this.getSubscribers(this.selectedDayTerm, this.startDate, this.endDate)
    }
    /* Pagination based on all data */
    else {
      this.subscriberService.getAllSubscriber(this.paginateConfig.itemsPerPage, this.paginateConfig.currentPage-1)
      .subscribe(
        (res: any) => {
          this.subscriberList = res.data;
          this.paginateConfig.totalItems = res?.count[0]?.totalCount;
          this.inProgress = false;
        }, err => {
          this.alertService.error(err.error.message, err.status);
          this.inProgress = false;
        }
      );
    }
  }

  // Copy user email
  copyToClipboard(event: MouseEvent, email: string | undefined) {
    event.preventDefault();

    if(!email) {
      return;
    }
    
    navigator.clipboard.writeText(email);
  }

  /* Get Subscribers based on Filter - Start */
  selectTimeframe(value: any) {
    this.selectedDayTerm = value;
    this.inSearch = false;
    this.getSubscribers(this.selectedDayTerm);
    this.paginateConfig.currentPage = 1;
    this.customForm?.reset();
  }
  /* Get Subscriber based on Filter - End */

  initForm(): void {
    this.customForm = new FormGroup({
      fromDate: new FormControl<Date | null>(null),
      toDate: new FormControl<Date | null>(null),
    });
  }

  get f() { return this.customForm.controls; }

  dateRangeChange(dateRangeStart: HTMLInputElement, dateRangeEnd: HTMLInputElement) {
    if(!this.customForm.valid) {
      return
    }

    const spanElement = this.elementRef.nativeElement.querySelector('.mat-date-range-input-separator');
    if (spanElement) {
      this.renderer.setProperty(spanElement, 'innerHTML', 'to');
    }

    this.startDate = dateRangeStart.value
    this.endDate = dateRangeEnd.value
    this.selectedDayTerm = 'custom'
    this.inProgress = true;
    this.inSearch = false;
    setTimeout( ()=>{
      this.getSubscribers(this.selectedDayTerm, this.startDate, this.endDate)
    }, 1000)
    
    this.paginateConfig.currentPage = 1;

  }

  /* Get filtered data - Start */
  getSubscribers(value?: any, fromDate?: any, toDate?: any) {
    this.inProgress = true;
    this.subscriberService.getFilteredSubscribersList(value, fromDate, toDate,this.paginateConfig.itemsPerPage, this.paginateConfig.currentPage-1).subscribe((res: any) => {
      if(res) {
        this.subscriberList = res.data;
        this.paginateConfig.totalItems = res?.count[0]?.totalCount;
        this.inProgress = false
      }
    }, err => {
      this.alertService.error(err.error.message);
      this.inProgress = false;
    })
  }
  /* Get filtered data - End */

  ngOnDestroy(): void {
    this.inSearch = false
    this._searchService.searchedTerm = ''
  }
}
