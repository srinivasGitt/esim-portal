import { Component, OnInit } from '@angular/core';
import { ConfirmComponent } from 'src/app/shared/dialog/confirm/confirm.component';
import { UserMgmtComponent } from 'src/app/shared/dialog/user-mgmt/user-mgmt.component';
import { DialogService } from 'src/app/shared/service/dialog';
import { PlansService } from 'src/app/shared/service/plans.service';
import { RegionsService } from 'src/app/shared/service/regions.service';
import { UsersService } from 'src/app/shared/service/users.service';
import { InviteUserComponent } from 'src/app/shared/dialog/invite-user/invite-user.component'
import { AlertService } from 'src/app/shared/service/alert.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  usersList: any = [];
  regionList: any = [];
  planList: any = [];
  constructor(private dialogService: DialogService,
              private usersService: UsersService,
              private regionService: RegionsService,
              private planService: PlansService,
              private alertService: AlertService) { }

  ngOnInit(): void {
    this.getAllUsers();
    
  }

  getAllRegions(): void {
    this.regionService.getAllRegions()
    .subscribe(
      res => {
        this.regionList = res;
        this.usersList.forEach((element: any) => {
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
        this.usersList.forEach((element: any) => {
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

  createUser() {
    this.dialogService.openModal(UserMgmtComponent, { cssClass: 'modal-md', context: {data: {}, title: 'Add New User'} })
      .instance.close.subscribe((data: any) => {
        if (data) {
          let vm  = this;
          this.alertService.success('User Created');
          this.getAllUsers();
          // vm.usersList.push(data);
        }
        });
  }
  getAllUsers() {
    this.usersService.getAllUsers()
    .subscribe(
      (data: any) => {
        this.usersList = data;
        this.getAllRegions();
      this.getAllPlans();
        // this.subscriptionList = data;
      }, err => {
        this.alertService.error(err.error.message);
      }
    );

  }

  editUser(index: number) {
    this.dialogService.openModal(UserMgmtComponent, { cssClass: 'modal-md', context: {data: this.usersList[index], title: 'Edit User'} })
      .instance.close.subscribe((data: any) => {
        let vm  = this;
        vm.usersList[index] = data;
        this.alertService.success('User Updated');
        this.getAllUsers();
        });
  }

  deleteUser( index: number) {
    this.dialogService.openModal(ConfirmComponent, { cssClass: 'modal-sm', context: {message: 'Are you sure want to delete this user?'} })
    .instance.close.subscribe((data: any) => {
      const vm = this;
      if (data) {
        vm.usersService.deleteUser(vm.usersList[index]._id)
        .subscribe(res => {
          vm.usersList.splice(index, 1);
          this.alertService.success('User Deleted');
        }, err => {
          this.alertService.error(err.error.message);
        })
      }
      });
    }

    // Invite User
    userInvite(){
      this.dialogService.openModal(InviteUserComponent, { cssClass: 'modal-md', context: {data: {}, title: 'Invite User'} })
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
