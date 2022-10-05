import { Component, OnInit } from '@angular/core';
import { V4MAPPED } from 'dns';
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
    this.dialogService.openModal(SubscriptionDialogComponent, { cssClass: 'modal-md', context: {data: {}, title: 'Add New Subscription'} })
      .instance.close.subscribe((data: any) => {
        let vm  = this;
        vm.subscriptionsService.createSubscription(data)
        .subscribe( (res: any) => {
          console.log(res);
          vm.subscriptionList.push(res);
        }, err => {
          console.log(err);
        })
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
    this.dialogService.openModal(SubscriptionDialogComponent, { cssClass: 'modal-md', context: {data: this.subscriptionList[index], title: 'Edit Subscription'} })
      .instance.close.subscribe((data: any) => {
        let vm  = this;
        vm.subscriptionsService.updateSubscription(vm.subscriptionList[index]._id, data)
        .subscribe( (res: any) => {
          vm.subscriptionList[index] = res;
        }, err => {
          console.log(err);
        })
        });
  }
}
