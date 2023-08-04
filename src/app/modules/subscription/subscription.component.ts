import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfirmComponent } from 'src/app/shared/dialog/confirm/confirm.component';
import { SubscriptionDialogComponent } from 'src/app/shared/dialog/subscription/subscription.component';
import { DialogService } from 'src/app/shared/service/dialog';
import { SubscriptionsService } from 'src/app/shared/service/subscriptions.service';
import { AlertService } from 'src/app/shared/service/alert.service';
import { PaginationInstance } from 'ngx-pagination';
import { SubscriptionInfoComponent } from 'src/app/shared/dialog';
import { SearchService } from 'src/app/shared/service/search/search.service';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit, OnDestroy {

  subscriptionList: any = [];
  paginateConfig: PaginationInstance = {
    id: 'subscriptionListPagination',
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
  currencyType: string = 'USD';

  constructor(private subscriptionsService: SubscriptionsService,
              private dialogService: DialogService,
              private alertService : AlertService, 
              private _searchService: SearchService) {
                _searchService.getResults().subscribe((results: any) => {
                  if(results) {
                    this.subscriptionList = results?.data
                    this.paginateConfig.totalItems = results?.count[0]?.totalCount;
                    this.paginateConfig.currentPage = 1;
                    this.inSearch = true;
                  }
                })
              }
  ngOnInit(): void {
    this.getAllSubscription();
  }
  
  createSubscription() {
    this.dialogService.openModal(SubscriptionDialogComponent, { cssClass: 'modal-lg', context: {data: {}, title: 'Add New Subscription'} })
      .instance.close.subscribe((data: any) => {
        if(data){
          console.log(data)
            this.alertService.success('Subscription Created');
            this.paginateConfig.currentPage = 1;
            this.getAllSubscription();
          } 
        })
  }

  getAllSubscription() {
    this.currencyType = localStorage.getItem('currency')!;

    this.inProgress = true;
    this.subscriptionsService.subscriptionList()
    .subscribe(
      (res: any) => {
        this.subscriptionList = res.data;
        this.paginateConfig.totalItems = res?.count[0]?.totalCount;
        this.inProgress = false;
      }, err => {
        this.alertService.error(err.error.message, err.status);
        this.inProgress = false;
      }
    );

  }
  editSubscription(subscription : any) {
    this.dialogService.openModal(SubscriptionDialogComponent, { cssClass: 'modal-lg', context: {data: subscription, title: 'Edit Subscription'} })
      .instance.close.subscribe((data: any) => {
        if(data){
          this.subscriptionList = this.subscriptionList.map((s : any) => {if(s._id == subscription._id) s = data; return s;});
          this.alertService.success('Plan Updated');
          this.paginateConfig.currentPage = 1;
          this.getAllSubscription();
          // this.subscriptionsService.updateSubscription(subscription._id, data)
          // .subscribe( (res: any) => {
          //   this.subscriptionList[index] = res;
          //   this.alertService.success('Subscription Updated');
          // }, err => {
          //   this.alertService.error(err.error.message);
          // })
        }
      }, (err: any) => {
        this.alertService.error(err.error.message, err.status);
      });
  }

  deleteSubscription( subscriber : any) {
    let data = {
      title: `Delete Subscription  "${subscriber?._id}"?`,
      icon: 'trash',
      showCloseBtn: true,
      buttonGroup: [
        { cssClass: 'btn-danger-scondary', title: 'Cancel', value: false},
        { cssClass: 'btn-danger ms-auto', title: 'Delete', value: true}
      ]
    };
    this.dialogService.openModal(ConfirmComponent, { cssClass: 'modal-sm', context: {message: 'Are you sure you want to delete this subscription? This action cannot be undone.', data} })
    .instance.close.subscribe((data: any) => {
      if (data) {
        this.subscriptionsService.deleteSubscription(subscriber._id)
        .subscribe(res => {
          this.subscriptionList = this.subscriptionList.filter((s : any) => s._id != subscriber._id);
          this.alertService.success('Subscription Deleted');
          this.paginateConfig.currentPage = 1;
          this.getAllSubscription();
        }, err => {
          this.alertService.error(err.error.message, err.status);
        })
      }
    });
  }

  showSubscriptionInfo(subscription : any){
    this.dialogService.openModal(SubscriptionInfoComponent, { cssClass: 'modal-md', context: {data: subscription} })
    .instance.close.subscribe((data: any) => {

    },
    (error : any) =>{

    });
  }

  searchRecord(searchTerm ?: any){
    if(searchTerm?.length > 2){
      this.filterConfig.searchTerm = searchTerm;
    } else {
      this.filterConfig.searchTerm = "";
    }
  }

  getPageNumber(event: any) {
    this.inProgress = true;
    this.paginateConfig.currentPage = event; 

    /* Pagination based on searched data */
    if(this.inSearch && this._searchService.searchedTerm.length > 3) {
      this._searchService.getSearchResult('/subscriptions', this._searchService.searchedTerm,this.paginateConfig.itemsPerPage, this.paginateConfig.currentPage-1).subscribe((result: any) => {
        this.subscriptionList = result.data;
        this.paginateConfig.totalItems = result?.count[0]?.totalCount;
        this.inProgress = false;
      })
    } 
    /* Pagination based on all data */
    else {
      this.subscriptionsService.subscriptionList(this.paginateConfig.itemsPerPage, this.paginateConfig.currentPage-1)
      .subscribe(
        (res: any) => {
          this.subscriptionList = res.data;
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
    
  ngOnDestroy(): void {
    this.inSearch = false
    this._searchService.searchedTerm = ''
  }
}
