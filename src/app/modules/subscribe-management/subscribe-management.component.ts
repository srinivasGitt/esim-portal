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

@Component({
  selector: 'app-subscribe-management',
  templateUrl: './subscribe-management.component.html',
  styleUrls: ['./subscribe-management.component.scss']
})
export class SubscribeManagementComponent implements OnInit {
  subscriberList:any;
  regionList: any = [];
  planList: any = [];

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
    this.dialogService.openModal(SubscriberMgmtComponent, { cssClass: 'modal-md', context: {data: {}, title: 'Add New User'} })
      .instance.close.subscribe((data: any) => {
        if (data) {
          let vm  = this;
          this.getAllSubscriber();
          // vm.usersList.push(data);
        }
        });
  }

  getAllSubscriber() {
    this.subscriberService.getAllSubscriber()
    .subscribe(
      (data: any) => {
        this.subscriberList = data;
        this.getAllRegions();
      this.getAllPlans();
        // this.subscriptionList = data;
      }, err => {
        this.alertService.error(err.error.message);
      }
    );

  }
  editSubscriber(index: number) {
    this.dialogService.openModal(SubscriberMgmtComponent, { cssClass: 'modal-md', context: {data: this.subscriberList[index], title: 'Edit User'} })
      .instance.close.subscribe((data: any) => {
        let vm  = this;
        vm.subscriberList[index] = data;
        });
  }
  deleteSubscriber( index: number) {
    this.dialogService.openModal(ConfirmComponent, { cssClass: 'modal-sm', context: {message: 'Are you sure want to delete this user?'} })
    .instance.close.subscribe((data: any) => {
      const vm = this;
      if (data) {
        vm.subscriberService.deleteSubscriber(vm.subscriberList[index]._id)
        .subscribe(res => {
          vm.subscriberList.splice(index, 1);
        }, err => {
          this.alertService.error(err.error.message);
        })
      }
      });
    }


  SubscriberInvite(){
    this.dialogService.openModal(InviteSubscriberComponent, { cssClass: 'modal-md', context: {data: {}, title: 'Invite User'} })
    .instance.close.subscribe((data: any) => {
      console.log(data);
      // if (data) {
      //   let vm  = this;
      //   this.getAllUsers();
      //   // vm.usersList.push(data);
      // }
      });
  }
}
