import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class subscriberService {
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
  createSubscriber(data: any) {
    return this.http.post(`${this.serverUrl}/subscriber`, data, this.getHeader());
  }
  getAllSubscriber() {
    return this.http.get(`${this.serverUrl}/subscriber`, this.getHeader());
  }
  updateSubscriber(id: any, data: any) {
    return this.http.put(`${this.serverUrl}/subscriber/${id}`, data, this.getHeader());
  }
  deleteSubscriber(id: any) {
    return this.http.delete(`${this.serverUrl}/subscriber/${id}`, this.getHeader());
  }

  // Invite Subscriber
  inviteSubscriber(data:any){
    return this.http.post(`${this.serverUrl}/subscriber/invite-subscriber`, data, this.getHeader());
  }
}
