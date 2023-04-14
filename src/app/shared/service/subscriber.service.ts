import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class subscriberService {
  serverUrl = environment.serverUrl;

  constructor(private http: HttpClient ) { }

  /* 
  ************************************
  Commented to check with interceptor
  ************************************
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

  createSubscriber(data: any) {
    return this.http.post(`${this.serverUrl}/subscribers`, data, this.getHeader());
  }
  getAllSubscriber() {
    return this.http.get(`${this.serverUrl}/subscribers`, this.getHeader());
  }

  getSingleSubscriber(subscriberId: string) {
    return this.http.get(`${this.serverUrl}/subscribers/${subscriberId}`, this.getHeader());
  }

  updateSubscriber(id: any, data: any) {
    return this.http.put(`${this.serverUrl}/subscribers/${id}`, data, this.getHeader());
  }
  deleteSubscriber(id: any) {
    return this.http.delete(`${this.serverUrl}/subscribers/${id}`, this.getHeader());
  }

  // Invite Subscriber
  inviteSubscriber(data:any){
    return this.http.post(`${this.serverUrl}/subscriber/invite-subscriber`, data, this.getHeader());
  }
  */

  createSubscriber(data: any) {
    return this.http.post(`${this.serverUrl}/subscribers`, data);
  }

  getAllSubscriber() {
    return this.http.get(`${this.serverUrl}/subscribers`);
  }

  getSingleSubscriber(subscriberId: string) {
    return this.http.get(`${this.serverUrl}/subscribers/${subscriberId}`);
  }

  updateSubscriber(id: any, data: any) {
    return this.http.put(`${this.serverUrl}/subscribers/${id}`, data);
  }
  
  deleteSubscriber(id: any) {
    return this.http.delete(`${this.serverUrl}/subscribers/${id}`);
  }

  // Invite Subscriber
  inviteSubscriber(data:any){
    return this.http.post(`${this.serverUrl}/subscriber/invite-subscriber`, data);
  }
}
