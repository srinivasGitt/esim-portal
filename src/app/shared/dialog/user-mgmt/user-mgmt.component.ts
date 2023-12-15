import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { DialogComponent } from '../../service/dialog';
import { PlansService } from '../../service/plans.service';
import { RegionsService } from '../../service/regions.service';
import { UsersService } from '../../service/users.service';
import { AlertService } from '../../service/alert.service';
import { trimSpaceValidator } from '../../validators/trimSpaceValidator';

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
  submitted = false;
  customerId: any;
  
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
    this.customerId = this.dialogRef.context.customerId;
    this.createuserForm();
  }

  getAllRegions(): void {
    this.regionService.getAllRegions()
    .subscribe(
      (res:any) => {
        this.regionList = res;
      }, err => {
        this.alertService.error(err.error.message, err.status);
      }
    )
  }

  getAlPlans(): void {
    this.planService.listPlans()
    .subscribe(
      res => {
        this.planList = res;
      }, err => {
        this.alertService.error(err.error.message, err.status);
      }
    )
  }

  createuserForm() {
    this.userForm = new UntypedFormGroup({
      email: new UntypedFormControl(this.title === 'Edit User' ? {value: this.data?.email, disabled: true} : this.data?.email, [Validators.required, Validators.email]),
      firstName: new UntypedFormControl(this.data?.firstName, [Validators.required, Validators.maxLength(32), trimSpaceValidator]),
      lastName: new UntypedFormControl(this.data?.lastName, [Validators.required, Validators.maxLength(32), trimSpaceValidator]),
      mobile: new UntypedFormControl(this.data?.mobile, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
    });
  }

  get f() { return this.userForm.controls; }

  submit() {
    if (this.title === 'Edit User') {
      this.update();
    } else {
      this.createUser();
    }
  }

  createUser() {
    this.submitted = true;

    if(this.userForm.invalid) {
      return;
    }

    this.userForm.value.customerId = this.customerId;
    
    this.usersService.createUsers(this.userForm.value)
    .subscribe((res: any) => {
      this.dialogRef.close.emit(res);
    }, err => {
      this.alertService.error(err.error.message, err.status);
    })
  }

  update() {
    this.submitted = true;

    if(this.userForm.invalid) {
      return;
    }

    this.usersService.updateUser(this.data._id, this.userForm.value)
    .subscribe( (res: any) => {
      this.dialogRef.close.emit(res);
    }, err => {
      this.alertService.error(err.error.message, err.status);
    })
  }

  /* Restrict user to enter alphabets in mobile field */
  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  close(): void {
    // this.data.amount = 343;
    this.dialogRef.close.emit();
  }


}
