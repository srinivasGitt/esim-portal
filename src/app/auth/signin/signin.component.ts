import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/service/auth.service';
import { AlertService } from 'src/app/shared/service/alert.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  signinForm: any;
  submitted = false;
  err = false;
  constructor(private authService: AuthService,
              private router: Router,
              private alertService : AlertService) { }

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
    .subscribe( (data: any) => {
      localStorage.setItem('authToken', data.token);
      this.router.navigate(['/']);
    }, err => {
      this.err = true;
      console.log(err);
      this.alertService.error(err.error.message);
    });
  }

}
