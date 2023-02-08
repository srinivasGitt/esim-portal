import { Component, OnInit } from '@angular/core';
import { ConfirmComponent } from 'src/app/shared/dialog/confirm/confirm.component';
import { SubscriptionDialogComponent } from 'src/app/shared/dialog/subscription/subscription.component';
import { DialogService } from 'src/app/shared/service/dialog';
import { SubscriptionsService } from 'src/app/shared/service/subscriptions.service';
import { AlertService } from 'src/app/shared/service/alert.service';
import { PaginationInstance } from 'ngx-pagination';
import { SubscriptionInfoComponent } from 'src/app/shared/dialog';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {

  subscriptionList: any = [];
  paginateConfig: PaginationInstance = {
    id: 'subscriptionListPagination',
    itemsPerPage: 20,
    currentPage: 1,
    totalItems: 0
  };
  constructor(private subscriptionsService: SubscriptionsService,
              private dialogService: DialogService,
              private alertService : AlertService) { }
  ngOnInit(): void {
    this.getAllSubscription();
  }
  createSubscription() {
    this.dialogService.openModal(SubscriptionDialogComponent, { cssClass: 'modal-md', context: {data: {}, title: 'Add New Subscription'} })
      .instance.close.subscribe((data: any) => {
        if(data){
          let vm  = this;
          vm.subscriptionsService.createSubscription(data)
          .subscribe( (res: any) => {
          
            vm.subscriptionList.push(res);
            this.alertService.success('Subscription Created');
          }, err => {
            this.alertService.error(err.error.message);
          })
        }
        });
  }
  getAllSubscription() {
    this.subscriptionsService.subscriptionList()
    .subscribe(
      (data: any) => {
        this.subscriptionList = data;
        this.paginateConfig.totalItems = data?.length;
      }, err => {
        this.alertService.error(err.error.message);
      }
    );

  }
  editSubscription(index: number) {
    this.dialogService.openModal(SubscriptionDialogComponent, { cssClass: 'modal-md', context: {data: this.subscriptionList[index], title: 'Edit Subscription'} })
      .instance.close.subscribe((data: any) => {
        if(data){
          let vm  = this;
        vm.subscriptionsService.updateSubscription(vm.subscriptionList[index]._id, data)
        .subscribe( (res: any) => {
          vm.subscriptionList[index] = res;
          this.alertService.success('Subscription Updated');
        }, err => {
          this.alertService.error(err.error.message);
        })
        }
        
        });
  }

  deleteSubscription( index: number) {
    let data = {
      title: `Delete Subscription  "${this.subscriptionList[index].subscriptionNumber}"?`,
      icon: 'trash',
      showCloseBtn: true,
      buttonGroup: [
        { cssClass: 'btn-danger-scondary', title: 'Cancel', value: false},
        { cssClass: 'btn-danger ms-auto', title: 'Delete', value: true}
      ]
    };
    this.dialogService.openModal(ConfirmComponent, { cssClass: 'modal-sm', context: {message: 'Are you sure you want to delete this subscription? This action cannot be undone.', data} })
    .instance.close.subscribe((data: any) => {
      const vm = this;
      if (data) {
        vm.subscriptionsService.deleteSubscription(vm.subscriptionList[index]._id)
        .subscribe(res => {
          vm.subscriptionList.splice(index, 1);
          this.alertService.success('Subscription Deleted');
        }, err => {
          this.alertService.error(err.error.message);
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
}
