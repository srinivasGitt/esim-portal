import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
}
