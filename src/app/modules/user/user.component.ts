import { Component, OnInit } from '@angular/core';
import { ConfirmComponent } from 'src/app/shared/dialog/confirm/confirm.component';
import { UserMgmtComponent } from 'src/app/shared/dialog/user-mgmt/user-mgmt.component';
import { DialogService,PlansService, RegionsService, UsersService, AlertService } from 'src/app/shared/service';
import { InviteUserComponent, UserInfoComponent } from 'src/app/shared/dialog';
import { PaginationInstance } from 'ngx-pagination';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  usersList: any = [];
  regionList: any = [];
  planList: any = [];
  monthsList: Array<string> = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  selectedFilter!: {month: number, year: number}; 
  currentYear!: number;
  currentMonth!: number;
  paginateConfig: PaginationInstance = {
    id: 'userListPagination',
    itemsPerPage: 20,
    currentPage: 1,
    totalItems: 0
  };
  filterConfig: any = {
    searchTerm: '',
    searchKey: 'email',
    filterBy: { key : 'created', type: 'date', value: undefined }
  };
  userDetails: any;

  constructor(private dialogService: DialogService,
              private usersService: UsersService,
              private regionService: RegionsService,
              private planService: PlansService,
              private alertService: AlertService) { 
                usersService.getCurrentUser()
                  .subscribe((res: any) => {
                    this.userDetails = res;
                    console.log(res);
                  });
              }

  ngOnInit(): void {
    
    this.getAllUsers();
    const date = new Date();
    this.selectedFilter = {
      month : date.getMonth(),
      year : date.getFullYear()
    };
    this.currentYear = date.getFullYear();
    this.currentMonth = date.getMonth();
    this.filterConfig.filterBy.value = this.selectedFilter;
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
    this.dialogService.openModal(UserMgmtComponent, { cssClass: 'modal-md', context: {data: {}, title: 'Add New User', customerId: this.userDetails.customerId} })
      .instance.close.subscribe((data: any) => {
        if (data) {
          this.getAllUsers();
          this.alertService.success('User Created');
        }
      });
  }

  getAllUsers() {
    this.usersService.getAllUsers()
    .subscribe(
      (data: any) => {
        this.usersList = data;
        // this.getAllRegions();
        // this.getAllPlans();
      }, err => {
        this.alertService.error(err.error.message);
      }
    );

  }

  editUser(index: number) {
    this.dialogService.openModal(UserMgmtComponent, { cssClass: 'modal-md', context: {data: this.usersList[index], title: 'Edit User'} })
      .instance.close.subscribe((data: any) => {
        let vm  = this;
        if(data){
          vm.usersList[index] = data;
          this.alertService.success('User Updated');
          this.getAllUsers();
        }
        });
  }

  deleteUser( index: number) {
    let data = {
      title: 'Delete User?',
      icon: 'trash',
      showCloseBtn: true,
      buttonGroup: [
        { cssClass: 'btn-danger-scondary', title: 'Cancel', value: false},
        { cssClass: 'btn-danger ms-auto', title: 'Delete', value: true}
      ]
    };

    this.dialogService.openModal(ConfirmComponent, { cssClass: 'modal-sm', context: {message: 'Are you sure you want to delete this user? This action cannot be undone.', data} })
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
      if (data) {
        this.getAllUsers();
      // vm.usersList.push(data);
      }
      });
  }

  userInfo(user: any, index: number) {
    this.dialogService.openModal(UserInfoComponent, { cssClass: 'modal-md', context: {data: user} })
    .instance.close.subscribe((data: any) => {
      if(data === 'edit') {
        this.editUser(index);
      }
    },
    (error : any) =>{

    });
  }

  searchRecord(searchTerm ?: any){
    if(searchTerm?.length > 2){
      this.filterConfig.searchTerm = searchTerm;
    } else {
      this.filterConfig.searchTerm = "";
    }
  }

  changeCalendarValue(changeBy: string, key: string){
    if( key == 'month'){
      if(changeBy == 'decrease'){
        this.selectedFilter.year = this.selectedFilter.month == 0 ? this.selectedFilter.year - 1 : this.selectedFilter.year; 
        this.selectedFilter.month = this.selectedFilter.month == 0 ? 11 : this.selectedFilter.month - 1;
      } else {
        this.selectedFilter.year = this.selectedFilter.month == 11 ?  this.selectedFilter.year + 1 : this.selectedFilter.year;
        this.selectedFilter.month = this.selectedFilter.month == 11 ? 0 : this.selectedFilter.month + 1;
      }
    } else if( key == 'year'){
      if(changeBy == 'decrease'){
        --this.selectedFilter.year;
      } else {
        ++this.selectedFilter.year;
      }
    }
    this.filterConfig.filterBy.value = this.selectedFilter;
  }
}
