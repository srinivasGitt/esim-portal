import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionsService {
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

  subscriptionList() {
    return this.http.get(`${this.serverUrl}/subscriptions`, this.getHeader());
  }

  createSubscription(data: any) {
    // data = {
    //   subscriptionNumber: 87654390,
    //   amount: 120,
    //   profile: 'This is my profile',
    //   status: 'active',
    //   autoRefill: true,
    //   startDate:  new Date(),
    //   endDate: new Date(),
    //   userId: '633c417b4a43b0703742cfa3',
    //   planId: '633c417b4a43b0703742cfa3',
    // };
    data.userId = '633c417b4a43b0703742cfa3';
    return this.http.post(`${this.serverUrl}/subscriptions`, data, this.getHeader());
  }

  updateSubscription(id: any, data: any) {
    console.log(data);
    return this.http.put(`${this.serverUrl}/subscriptions/${id}`, data, this.getHeader());
  }
}
