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
  showOTPSection = false;
  otpError = false;
  public settings = {
    length: 6,
    numbersOnly: true,
    timer: 120,
    timerType: 1
  }
  
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

      this.authService.forgotPassword(userData)           //api call
      .subscribe( (data: any) => {
        this.showOTPSection = true;
      }, error => {
        // this.err =  error.error.message;
        this.showOTPSection = false;
        this.forgotPasswordForm.controls['email'].setErrors({'incorrect' : true});
        this.err = true;
        console.log(error);
      });
    }

    onOTPChange(e : any) {
      if(e.length == this.settings.length) {
        const userData = {
          email: this.forgotPasswordForm.get('email').value,
          otp: e
        };
        this.authService.validateOTP(userData).subscribe(( data: any) => {
          this.router.navigate(['/reset-password'], { state: {otp : userData.otp}});
        }, error => {
          this.otpError = true;
          console.log(error)
        })
      } else if(e == -2){
        this.submit();
      }
    }
  }



