import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogComponent } from '../../service/dialog';
import { RegionsService } from '../../service';

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
  title: string = 'Invite User';
  isEdit: boolean = true;
  dialogRef: DialogComponent;
  countryList: Array<any> = [
    {'name': 'India', 'dial_code': '+91'},
    {'name': 'USA', 'dial_code': '+1'},
  ];

  constructor(private viewContainer: ViewContainerRef) {
    const _injector = this.viewContainer.injector;
    this.dialogRef = _injector.get<DialogComponent>(DialogComponent);
  }

  ngOnInit(): void {
  }

  close(): void {
    this.dialogRef.close.emit(false);
  }

  submitForm(){

  }

  trackCountries(index: any, item : any) {
    return item._id;
  }
}
