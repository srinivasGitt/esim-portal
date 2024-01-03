import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/service/auth.service';
import { AlertService } from 'src/app/shared/service/alert.service';
import { LocalStorageService } from 'src/app/shared/service/local-storage.service';
import { ConfigurationService } from 'src/app/shared/service/configuration.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  signinForm: any;
  showPassword: boolean = false;
  submitted = false;
  err = false;
  errMsg: string = '';

  constructor(private authService: AuthService,
              private router: Router,
              private alertService : AlertService,
              private _localStorageService: LocalStorageService,
              private configurationService: ConfigurationService) { }

  ngOnInit(): void {
    this.createForm();
  }
  createForm() {
    this.signinForm = new UntypedFormGroup({
      email: new UntypedFormControl(null, [Validators.required, Validators.email]),
      password: new UntypedFormControl(null, [Validators.required])
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
      .subscribe((res: any) =>{
        this._localStorageService.setToken(res.token);
        this.getClientConfiguration();        
      }, (err: any) =>{
        this.errMsg = err?.error?.message
        this.err = true;
        // if(err?.error?.message?.includes('User not found')){
        //   this.signinForm.controls['email'].setErrors({'incorrect' : true});
        // } else if(err?.error?.message?.includes('Password is incorrect')){
        //   this.signinForm.controls['password'].setValue('');
        //   this.signinForm.controls['password'].setErrors({'incorrect' : true});
        //   this.err = true;
        // } else {
        //   this.signinForm.controls['email'].setErrors({'incorrect' : true});
        //   this.signinForm.controls['password'].setValue('');
        //   this.signinForm.controls['password'].setErrors({'incorrect' : true});
        //   this.err = true;
        // }
      })
  }

  // Client Feature Configuration
  getClientConfiguration() {
    const clientConfig = JSON.parse(localStorage.getItem('config')!);
    
    this.configurationService.getConfigurationSetting(clientConfig?.cacheId).subscribe((res: any) => {
      if(res && res.data) {
        this._localStorageService.setCacheConfig(JSON.stringify(res.data));
        window.location.href = '/';
      }
    }, err => {
      this.alertService.error(err.error.message, err.status);
    })
  }

}
