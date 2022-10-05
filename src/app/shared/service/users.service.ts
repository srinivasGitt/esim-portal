import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  serverUrl = environment.serverUrl;

  constructor(private http: HttpClient ) { }
  getHeader() {
    const authToken = localStorage.getItem('authToken');
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      })
    };
    return httpOptions;
  }

  // signin(userData: any) {
  //   return this.http.post(`${this.serverUrl}/auth/signin`, userData);
  // }
  // signup(userData: any) {
  //   return this.http.post(`${this.serverUrl}/auth/signin`, userData);
  // }
  createUsers(data: any) {
    return this.http.post(`${this.serverUrl}/users`, data, this.getHeader());
  }
  getAllUsers() {
    return this.http.get(`${this.serverUrl}/users`, this.getHeader());
  }
  updateUser(id: any, data: any) {
    return this.http.put(`${this.serverUrl}/users/${id}`, data, this.getHeader());
  }
}
