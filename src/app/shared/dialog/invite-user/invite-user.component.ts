import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { UsersService } from '../../service/users.service';
import { DialogComponent } from '../../service/dialog';

@Component({
  selector: 'app-invite-user',
  templateUrl: './invite-user.component.html',
  styleUrls: ['./invite-user.component.scss']
})
export class InviteUserComponent implements OnInit {
  dialogRef: DialogComponent;
  title: any = 'Invite User'
  userForm: any;
  constructor(
    private viewContainer: ViewContainerRef,
    private usersService : UsersService,
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
    console.log(this.userForm);
    
  }

  submitForm(){
    console.log(this.userForm.value);
    
    this.usersService.inviteUser(this.userForm.value)
    .subscribe((res:any)=>{
      console.log(res);
      this.dialogRef.close.emit(res);
    }, err => {
      // console.log(err);
      alert(err.error.message);
    })
  }

  close(): void {
    // this.data.amount = 343;
    this.dialogRef.close.emit(false);
  }
}
