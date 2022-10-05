import { Component, OnInit } from '@angular/core';
import { UserMgmtComponent } from 'src/app/shared/dialog/user-mgmt/user-mgmt.component';
import { DialogService } from 'src/app/shared/service/dialog';
import { PlansService } from 'src/app/shared/service/plans.service';
import { RegionsService } from 'src/app/shared/service/regions.service';
import { UsersService } from 'src/app/shared/service/users.service';

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
              private planService: PlansService) { }

  ngOnInit(): void {
    this.getAllUsers();
    
  }

  getAllRegions(): void {
    this.regionService.getAllRegions()
    .subscribe(
      res => {
        console.log(res);
        this.regionList = res;
        this.usersList.forEach((element: any) => {
          const tRegion = this.regionList.find((o: any) => o._id === element.regionId);
          if (tRegion) {
            element.region = tRegion.name;
          }
        });
      }, err => {
        console.log(err);
      }
    )
  }
  getAllPlans(): void {
    this.planService.listPlans()
    .subscribe(
      res => {
        console.log(res);
        this.planList = res;
        this.usersList.forEach((element: any) => {
          const tRegion = this.planList.find((o: any) => o._id === element.planId);
          if (tRegion) {
            element.planName = tRegion.name;
          }
        });
      }, err => {
        console.log(err);
      }
    )
  }

  createUser() {
    this.dialogService.openModal(UserMgmtComponent, { cssClass: 'modal-md', context: {data: {}, title: 'Add New User'} })
      .instance.close.subscribe((data: any) => {
        console.log(data);
        if (data) {
          let vm  = this;
          vm.usersList.push(data);
        }
        });
  }
  getAllUsers() {
    this.usersService.getAllUsers()
    .subscribe(
      (data: any) => {
        this.usersList = data;
        console.log(data);
        this.getAllRegions();
      this.getAllPlans();
        // this.subscriptionList = data;
      }, err => {
        console.log(err);
      }
    );

  }

  editUser(index: number) {
    this.dialogService.openModal(UserMgmtComponent, { cssClass: 'modal-md', context: {data: this.usersList[index], title: 'Edit User'} })
      .instance.close.subscribe((data: any) => {
        console.log(data);
        let vm  = this;
        vm.usersList[index] = data;
        });
  }
}
