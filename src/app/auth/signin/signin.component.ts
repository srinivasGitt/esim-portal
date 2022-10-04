import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SubscriptionComponent } from 'src/app/shared/dialog/subscription/subscription.component';
import { AuthService } from 'src/app/shared/service/auth.service';
import { DialogService } from 'src/app/shared/service/dialog';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  signinForm: any;
  submitted = false;
  err = false;
  constructor(private dialogService: DialogService,
              private authService: AuthService,
              private fb: FormBuilder) { }

  ngOnInit(): void {
    this.dialogService.openModal(SubscriptionComponent, { cssClass: 'modal-lg', context: 'Hi I am modal' })
      .instance.close.subscribe((data: any) => {
        console.log(data);
        });
    this.createForm();
  }
  createForm() {
    this.signinForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required])
    });
    
  }
  
  get f() { return this.signinForm.controls; }

  submit(): void {
    this.err = false;
    this.submitted = true;
    if (this.signinForm.invalid) {
      return;
    }

    const userData = {
      email: this.signinForm.get('email').value,
      password: this.signinForm.get('password').value
    };

    this.authService.signin(userData)
    .subscribe( (data: any) => {
      localStorage.setItem('authToken', data.token);
    }, err => {
      this.err = true;
      console.log(err);
    })
  }

}
