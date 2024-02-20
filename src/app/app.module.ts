import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PasswordStrengthMeterModule } from 'angular-password-strength-meter';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ForgotPasswordComponent, ResetPasswordComponent, SigninComponent } from './auth';
import { CoreComponent } from './core/core.component';
import { ModulesModule } from './modules/modules.module';
import { AuthService, CanMatchRoute, JwtInterceptor, Permissions } from './shared/service';
import { DialogComponent } from './shared/service/dialog';
import { SharedModule } from './shared/shared.module';

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
    BrowserAnimationsModule,
    RouterModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    SharedModule,
    ModulesModule,
    PasswordStrengthMeterModule.forRoot(),
  ],
  providers: [AuthService, { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }, CanMatchRoute, Permissions],
  bootstrap: [AppComponent],
})
export class AppModule {}
