import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaginationInstance } from 'ngx-pagination';
import { SubscriptionPlanInfoComponent } from 'src/app/shared/dialog';
import { DialogService, subscriberService } from 'src/app/shared/service';

@Component({
  selector: 'app-subscriber-subscriptions',
  templateUrl: './subscriber-subscriptions.component.html',
  styleUrls: ['./subscriber-subscriptions.component.scss']
})
export class SubscriberSubscriptionsComponent implements OnInit {

  subscriberDetails: any;
  inProgress: boolean = false;
  subscriptionList: Array<any> = [];
  paginateConfig: PaginationInstance = {
    id: 'subscriptionsListPagination',
    itemsPerPage: 20,
    currentPage: 1,
    totalItems: 0,
  };

  constructor(private dialogService: DialogService, private subscriberService: subscriberService,private route: ActivatedRoute) {
    route.params.subscribe((param : any) =>{
      this.getSubscriptionList(param.id);
    });
  }

  ngOnInit(): void {
  }

  getPageNumber(event: any) {
    this.inProgress = true;
    this.paginateConfig.currentPage = event;
    if(this.subscriberDetails?._id){
      this.getSubscriptionList(this.subscriberDetails?._id);
    }
  }

  getSubscriptionList(subscriberId: any){
    this.inProgress = true;
    this.subscriberService.getSubscriptionsList(subscriberId, this.paginateConfig).subscribe(
      (result : any) =>{
        this.subscriberDetails = result;
        this.paginateConfig.totalItems = this.subscriberDetails?.subscriptions[0]?.count[0]?.totalCount || 0;
        this.subscriptionList = this.subscriberDetails?.subscriptions[0]?.data || [];
        this.inProgress = false;
      }
    );
  }

  showSubscription(subscription: any) {
    this.dialogService
      .openModal(SubscriptionPlanInfoComponent, { cssClass: '', context: { data: { ...subscription, created: this.subscriberDetails.created, displayName: this.subscriberDetails.displayName, email: this.subscriberDetails.email }} })
      .instance.close.subscribe(
        (data: any) => {},
        (err) => {}
      );
  }
}
