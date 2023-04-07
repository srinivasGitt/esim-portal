import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfirmComponent } from 'src/app/shared/dialog/confirm/confirm.component';
import { InviteSubscriberComponent } from 'src/app/shared/dialog/invite-subscriber/invite-subscriber.component';
import { SubscriberMgmtComponent } from 'src/app/shared/dialog/subscriber-mgmt/subscriber-mgmt.component';
import { DialogService } from 'src/app/shared/service/dialog';
import { PlansService } from 'src/app/shared/service/plans.service';
import { RegionsService } from 'src/app/shared/service/regions.service';
import { subscriberService } from 'src/app/shared/service/subscriber.service';
import { AlertService } from 'src/app/shared/service/alert.service';
import { SubscriberInfoComponent } from 'src/app/shared/dialog';
import { PaginationInstance } from 'ngx-pagination';

@Component({
  selector: 'app-subscribe-management',
  templateUrl: './subscribe-management.component.html',
  styleUrls: ['./subscribe-management.component.scss']
})
export class SubscribeManagementComponent implements OnInit {
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

  constructor( private dialogService: DialogService,
              private subscriberService: subscriberService,
              private regionService: RegionsService,
              private planService: PlansService,
              private route: ActivatedRoute,
              private alertService: AlertService) { }

  ngOnInit(): void {
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
          this.getAllSubscriber();
        }
        });
  }

  getAllSubscriber() {
    this.inProgress = true;

    this.subscriberService.getAllSubscriber()
    .subscribe(
      (data: any) => {
        this.subscriberList = data;
        this.getAllRegions();
        this.getAllPlans();
        // this.subscriptionList = data;
        this.inProgress = false;
      }, err => {
        this.alertService.error(err.error.message);
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
        .subscribe(res => {
          this.subscriberList = this.subscriberList.filter((s : any) => s._id != subscriber._id);
          this.alertService.success('Subscriber Deleted');
        }, err => {
          this.alertService.error(err.error.message);
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
}
