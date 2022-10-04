import { Component, OnInit } from '@angular/core';
import { SubscriptionsService } from 'src/app/shared/service/subscriptions.service';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {

  subscriptionList: any = [];
  constructor(private subscriptionsService: SubscriptionsService) { }
  ngOnInit(): void {
    this.getAllSubscription();
  }

  createSubscription() {
    this.subscriptionsService.createSubscription({})
    .subscribe( (data: any) => {
      console.log(data);
    }, err => {
      console.log(err);
    });
  }
  getAllSubscription() {
    this.subscriptionsService.subscriptionList()
    .subscribe(
      (data: any) => {
        console.log(data);
        this.subscriptionList = data;

      }, err => {
        console.log(err);
      }
    );

  }
}
