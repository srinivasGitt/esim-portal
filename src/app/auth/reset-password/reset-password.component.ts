import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import {  ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/service/auth.service';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { AlertService } from 'src/app/shared/service/alert.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: any;
  submitted = false;
  err = false;
  token: any;
  passwordStrength: string = 'Weak';
  passwordStrengthIndex: number = 0;
  passwordStrengthColors: Array<string> = ['darkred', '#FFC400', 'yellowgreen', '#00C853'];
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
 

  constructor(private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              private alertService: AlertService) { }

  ngOnInit(): void {
    this.resetForm();
    this.route.params
      .subscribe(params => {
        this.token = params['token']; 
        if (this.token) {
          this.checkLinkValidation();
        }
      }
    );
    if(window.history?.state?.otp){
      this.token = window.history.state.otp;
    }
  }

  checkLinkValidation() {
    this.authService.checkLinkValidation(this.token)
      .subscribe((res: any) => {
        
      }, err => {
        if(err.error.message === 'Invalid Token.') {
          this.alertService.error(err.error.message);
          this.router.navigate(['/signin']);
        }
      });
  }
  
  resetForm(){
    this.resetPasswordForm = new UntypedFormGroup({
      password: new UntypedFormControl(null, [Validators.required, Validators.minLength(8)]),
      confirmPassword: new UntypedFormControl(null, {updateOn: 'change', validators: [Validators.required, Validators.minLength(8)]}),
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
      resetPasswordToken: this.token,
      newPassword: this.resetPasswordForm.get('password').value,
      verifyPassword: this.resetPasswordForm.get('confirmPassword').value,
    };

    this.authService.resetPssword(userData)
    .subscribe( (data: any) => {
      alert(data.message);
      this.router.navigate(['/signin']);
    }, err => {
      this.err = true;
      this.alertService.error(err.error.message);
      // console.log(err);
    });
  }
 
  onChangePasswordStrength(value: any){
    this.passwordStrengthIndex = value;
    switch(value){
      case 2:
        this.passwordStrength = 'Fair';
        break;
      case 3:
        this.passwordStrength = 'Strong';
        break;
      case 4:
        this.passwordStrength = 'Very strong';
        break;
      default:
        this.passwordStrength = 'Weak'
    }
  }



  
}
