import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { DialogComponent } from '../../service/dialog';
import { PlansService } from '../../service/plans.service';
import { RegionsService } from '../../service/regions.service';
import { UsersService } from '../../service/users.service';
import { AlertService } from '../../service/alert.service';

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
    private usersService: UsersService,
    private alertService: AlertService) {
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
      (res:any) => {
        console.log(res);
        this.regionList = res;
      }, err => {
        this.alertService.error(err.error.message);
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
        this.alertService.error(err.error.message);
      }
    )
  }
  createuserForm() {
    this.userForm = new UntypedFormGroup({
      email: new UntypedFormControl({value: this.data?.email, disabled: true}, [Validators.required, Validators.email]),
      firstName: new UntypedFormControl(this.data?.firstName, [Validators.required]),
      lastName: new UntypedFormControl(this.data?.lastName, [Validators.required]),
      regionId: new UntypedFormControl(this.data?.regionId, [Validators.required]),
      planId: new UntypedFormControl(this.data?.planId, [Validators.required]),
      endDate: new UntypedFormControl(this.data?.endDate, [Validators.required]),
      mobile: new UntypedFormControl(this.data?.mobile, [Validators.required]),
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
    .subscribe((res: any) => {
      console.log(res);
      this.dialogRef.close.emit(res);
    }, err => {
      this.alertService.error(err.error.message);
    })
  }
  update() {
    this.usersService.updateUser(this.data._id, this.userForm.value)
    .subscribe( (res: any) => {
      this.dialogRef.close.emit(res);
    }, err => {
      this.alertService.error(err.error.message);
    })
  }
  close(): void {
    // this.data.amount = 343;
    this.dialogRef.close.emit();
  }
}
