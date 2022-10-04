import { Component, OnInit } from '@angular/core';
import { SubscriptionDialogComponent } from 'src/app/shared/dialog/subscription/subscription.component';
import { DialogService } from 'src/app/shared/service/dialog';
import { SubscriptionsService } from 'src/app/shared/service/subscriptions.service';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {

  subscriptionList: any = [];
  constructor(private subscriptionsService: SubscriptionsService,
              private dialogService: DialogService) { }
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

  editSubscription(index: number) {
    this.dialogService.openModal(SubscriptionDialogComponent, { cssClass: 'modal-lg', context: {data: this.subscriptionList[index], title: 'Edit Subscription'} })
      .instance.close.subscribe((data: any) => {
        console.log(data);
        let vm  = this;
        vm.subscriptionsService.updateSubscription(data)
        .subscribe( (data: any) => {
          console.log(data);
        }, err => {
          console.log(err);
        })
        });
  }
}
