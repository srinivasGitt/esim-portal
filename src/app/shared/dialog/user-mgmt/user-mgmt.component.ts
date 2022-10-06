import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogComponent } from '../../service/dialog';
import { PlansService } from '../../service/plans.service';
import { RegionsService } from '../../service/regions.service';
import { UsersService } from '../../service/users.service';

@Component({
  selector: 'app-user-mgmt',
  templateUrl: './user-mgmt.component.html',
  styleUrls: ['./user-mgmt.component.scss']
})
export class UserMgmtComponent implements OnInit {
  dialogRef: DialogComponent;
  data: any;
  userForm: any;
  title: string = 'Add New User';
  regionList: any = [];
  planList: any = [];
  constructor(
    private viewContainer: ViewContainerRef,
    private regionService: RegionsService,
    private planService: PlansService,
    private usersService: UsersService) {
    const _injector = this.viewContainer.injector;
    this.dialogRef = _injector.get<DialogComponent>(DialogComponent);
  }
  ngOnInit(): void {
    this.data = this.dialogRef.context.data;
    this.title = this.dialogRef.context.title;
    this.createuserForm();
    this.getAllRegions();
    this.getAlPlans();
  }
  getAllRegions(): void {
    this.regionService.getAllRegions()
    .subscribe(
      res => {
        console.log(res);
        this.regionList = res;
      }, err => {
        console.log(err);
      }
    )
  }
  getAlPlans(): void {
    this.planService.listPlans()
    .subscribe(
      res => {
        console.log(res);
        this.planList = res;
      }, err => {
        console.log(err);
      }
    )
  }
  createuserForm() {
    // console.log(this.data?.amount);
    this.userForm = new FormGroup({
      email: new FormControl(this.data?.email, [Validators.required, Validators.email]),
      firstName: new FormControl(this.data?.firstName, [Validators.required]),
      lastName: new FormControl(this.data?.lastName, [Validators.required]),
      regionId: new FormControl(this.data?.regionId, [Validators.required]),
      planId: new FormControl(this.data?.planId, [Validators.required]),
      endDate: new FormControl(this.data?.endDate, [Validators.required]),
      mobile: new FormControl(this.data?.mobile, [Validators.required]),
    });
  }
  submit() {
    if (this.title === 'Edit User') {
      this.update();
    } else {
      this.createUser();
    }
  }
  createUser() {
    this.usersService.createUsers(this.userForm.value)
    .subscribe( (res: any) => {
      console.log(res);
      this.dialogRef.close.emit(res);
    }, err => {
      alert(err.error.message);
    })
  }
  update() {
    this.usersService.updateUser(this.data._id, this.userForm.value)
    .subscribe( (res: any) => {
      this.dialogRef.close.emit(res);
    }, err => {
      console.log(err);
    })
  }
  close(): void {
    // this.data.amount = 343;
    this.dialogRef.close.emit(false);
  }
}
