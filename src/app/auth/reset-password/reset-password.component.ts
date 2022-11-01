import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import {  ActivatedRoute, Router } from '@angular/router';
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
  token: any;
 

  constructor(private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.resetForm();
    this.route.queryParams
      .subscribe(params => {
        
        this.token = params['token']; 
        if (this.token) {
          this.checkLinValidation();
        }  
      
      }
    ); 
  }

  checkLinValidation() {
    this.authService.checkLinkValidation(this.token)
            .subscribe((res: any) => {
             
            }, err => {
              console.log(err.error.message);
              if(err.error.message === 'Invalid Token.') {
                alert(err.error.message);
                this.router.navigate(['/signin']);
              }
            });
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
      newPassword: this.resetPasswordForm.get('password').value,
      repeatPassword: this.resetPasswordForm.get('confirmPassword').value,
    };

    this.authService.resetPssword(this.token, userData)
    .subscribe( (data: any) => {
      alert(data.message)
      this.router.navigate(['/signin']);
    }, err => {
      this.err = true;
      console.log(err);
    });


   
  
  

 
}
  



  
}
