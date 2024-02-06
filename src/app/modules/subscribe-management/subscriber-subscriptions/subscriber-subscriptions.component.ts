import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PaginationInstance } from 'ngx-pagination';
import { SubscriberInfoComponent } from 'src/app/shared/dialog';
import { DialogService, subscriberService } from 'src/app/shared/service';

@Component({
  selector: 'app-subscriber-subscriptions',
  templateUrl: './subscriber-subscriptions.component.html',
  styleUrls: ['./subscriber-subscriptions.component.scss']
})
export class SubscriberSubscriptionsComponent implements OnInit {

  @Input() subscriberDetails: any;
  @Output() closeEvent = new EventEmitter(false);
  inProgress: boolean = false;

  subscriptions: Array<any> = [
    {
      name: 'Best plan for india fsdfs 154sas 14454ad sfdsfsdfsdfsdfdff  54545454',
      iccid: '12145353112154545454545454545',
      planExpired: new Date(),
      earnRewardPoints: 20,
      usedRewardPoints: 10,
      couponCode: 'NEWUSER ($5)',
      status: 'active'
    },
    {
      name: 'Best plan for india2',
      iccid: '121453531121545',
      planExpired: new Date(),
      earnRewardPoints: 20,
      usedRewardPoints: 10,
      couponCode: 'NEWUSER ($5)',
      status: 'active'
    }
  ];

  paginateConfig: PaginationInstance = {
    id: 'subscriptionsListPagination',
    itemsPerPage: 20,
    currentPage: 1,
    totalItems: 0,
  };

  constructor(private dialogService: DialogService, private subscriberService: subscriberService) { }

  ngOnInit(): void {
    this.getSubscriptionList();
  }

  back(){
    this.closeEvent.emit(true);
  }

  getPageNumber(event: any) {
    this.inProgress = true;
    this.paginateConfig.currentPage = event;

  }

  getSubscriptionList(){
    this.subscriberService.getSubscriptionsList(this.subscriberDetails._id).subscribe(
      (result : any) =>{
        this.subscriberDetails = result;
      }
    );
  }

  showSubscriber(subscriber: any) {
    this.dialogService
      .openModal(SubscriberInfoComponent, { cssClass: '', context: { data: subscriber } })
      .instance.close.subscribe(
        (data: any) => {},
        (err) => {}
      );
  }
}
