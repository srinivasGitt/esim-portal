import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SigninComponent } from './auth/signin/signin.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { DialogComponent } from './shared/service/dialog/dialog.component';
import { CoreComponent } from './core/core.component';
import { AuthService } from './shared/service/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './shared/shared.module';
import { ModulesModule } from './modules/modules.module';
import { RouterModule } from '@angular/router';
import { AngularOtpLibModule } from 'src/lib/angular-otp-box';
import { PasswordStrengthMeterModule } from 'angular-password-strength-meter';
import { TooltipDirective } from './shared/directive/tooltip.directive';

// import { NgChartsModule } from 'chart.js';



@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    DialogComponent,
    CoreComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    SharedModule,
    ModulesModule,
    AngularOtpLibModule,
    PasswordStrengthMeterModule.forRoot()
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
