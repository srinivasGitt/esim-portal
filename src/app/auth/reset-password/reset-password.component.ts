import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import {  Router } from '@angular/router';
import { AuthService } from 'src/app/shared/service/auth.service';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: any;
  submitted = false;
  err = false;

  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    this.resetForm();
  }
  
  resetForm(){
    this.resetPasswordForm = new UntypedFormGroup({
      password: new UntypedFormControl(null, [Validators.required, Validators.email]),
      confirmPassword: new UntypedFormControl(null, [Validators.required]),
    },
    [CustomValidators.MatchValidator('password', 'confirmPassword')]
    );
  }

  get f() { return this.resetPasswordForm.controls; }

  get passwordMatchError() {
    return (
      this.resetPasswordForm.getError('mismatch') &&
      this.resetPasswordForm.get('confirmPassword')?.touched
    );
  }


  submit(){

    this.err = false;
    this.submitted = true;
    if (this.resetPasswordForm.invalid) {
      return;
    }

    const userData = {
      email: this.resetPasswordForm.get('email').value,
     
    };


  }
}
