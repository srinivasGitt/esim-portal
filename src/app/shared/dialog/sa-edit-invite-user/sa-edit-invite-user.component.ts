import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogComponent } from '../../service/dialog';
import { RegionsService, UsersService } from '../../service';

@Component({
  selector: 'app-sa-edit-invite-user',
  templateUrl: './sa-edit-invite-user.component.html',
  styleUrls: ['./sa-edit-invite-user.component.scss']
})
export class SaEditInviteUserComponent implements OnInit {

  userForm: FormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phoneNumber: new FormControl('', [Validators.required]),
    role: new FormControl('admin', [Validators.required])
  });
  countryDialCode: string = '+91';
  submitted: boolean = false;
  isEdit: boolean = false;
  dialogRef: DialogComponent;
  userDetails: any;

  constructor(private viewContainer: ViewContainerRef, private userService: UsersService) {
    const _injector = this.viewContainer.injector;
    this.dialogRef = _injector.get<DialogComponent>(DialogComponent);
  }

  ngOnInit(): void {
  }

  close(): void {
    this.dialogRef.close.emit(false);
  }

  submitForm(){
    if(this.isEdit){
      this.updateUser() 
    } else {
      this.inviteUser();
    }
  }

  inviteUser(){
    this.userService.inviteUser(this.userForm.value).subscribe(
      (result : any) => {

      }
    )
  }

  updateUser(){
    this.userService.updateUser(this.userDetails._id, this.userForm.value).subscribe(
      (result : any) => {
        
      }
    )
  }

  trackCountries(index: any, item : any) {
    return item._id;
  }
}
