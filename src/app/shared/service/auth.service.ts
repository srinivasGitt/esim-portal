import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  serverUrl = environment.serverUrl;

  constructor(private http: HttpClient ) { }

  signin(userData: any) {
    return this.http.post(`${this.serverUrl}/auth/signin`, userData);
  }

  signup(userData: any) {
    return this.http.post(`${this.serverUrl}/auth/signin`, userData);
  }
  
  forgotPassword(userData: any) {
    return this.http.post(`${this.serverUrl}/auth/forgot`, userData);
  }

  checkLinkValidation(token: any){
    return this.http.get(`${this.serverUrl}/auth/reset/${token}`);
  }

  validateOTP(userData: any){
    return this.http.get(`${this.serverUrl}/auth/reset/${userData.otp}/${userData.email}`);
  }

  resetPssword(userData: any){
    return this.http.post(`${this.serverUrl}/auth/reset`, userData);
  }

  validateUser(email: string){
    return this.http.get(`${this.serverUrl}/auth/validate/${email}`);
  }
}
