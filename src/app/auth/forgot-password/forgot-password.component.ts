import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/service/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: any;
  submitted = false;
  err = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.forgotForm();
  }
  forgotForm(){
    this.forgotPasswordForm = new UntypedFormGroup({
      email: new UntypedFormControl(null, [Validators.required, Validators.email])
    });
  }

  get f() { return this.forgotPasswordForm.controls; }

  submit(){

    this.err = false;
    this.submitted = true;
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    const userData = {
      email: this.forgotPasswordForm.get('email').value,
     
    };

    
  }


}
