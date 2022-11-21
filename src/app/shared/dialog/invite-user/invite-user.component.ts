import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { UsersService } from '../../service/users.service';
import { DialogComponent } from '../../service/dialog';
import { AlertService } from '../../service/alert.service';

@Component({
  selector: 'app-invite-user',
  templateUrl: './invite-user.component.html',
  styleUrls: ['./invite-user.component.scss']
})
export class InviteUserComponent implements OnInit {
  dialogRef: DialogComponent;
  title: any = 'Invite User'
  userForm: any;
  submitted = false;
  
  constructor(
    private viewContainer: ViewContainerRef,
    private usersService : UsersService,
    private alertService: AlertService
  ) { 
    const _injector = this.viewContainer.injector;
    this.dialogRef = _injector.get<DialogComponent>(DialogComponent);
  }

  ngOnInit(): void {
    this.inviteUserForm();
  }

  inviteUserForm(){
    this.userForm = new UntypedFormGroup({
      email: new UntypedFormControl('', [Validators.required, Validators.email]),
      customerId: new UntypedFormControl(localStorage.getItem('customerId'))
    })
  }

  get f() { return this.userForm.controls; } 

  submitForm(){
    this.submitted = true;
    if (this.userForm.invalid) {
      return;
    }
    this.usersService.inviteUser(this.userForm.value)
    .subscribe((res:any)=>{
      this.dialogRef.close.emit(res);
      this.alertService.success('Successfully Invited');
    }, err => {
      this.alertService.error(err.error.message);
    })
  }

  close(): void {
    this.dialogRef.close.emit(this.userForm.value);
  }
}
