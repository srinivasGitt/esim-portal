import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionsService {
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

  subscriptionList() {
    return this.http.get(`${this.serverUrl}/subscriptions`, this.getHeader());
  }

  createSubscription(data: any) {
    data.userId = '633c417b4a43b0703742cfa3';
    return this.http.post(`${this.serverUrl}/subscriptions`, data, this.getHeader());
  }

  updateSubscription(id: any, data: any) {
    console.log(data);
    return this.http.put(`${this.serverUrl}/subscriptions/${id}`, data, this.getHeader());
  }

  deleteSubscription(id: any) {
    return this.http.delete(`${this.serverUrl}/subscriptions/${id}`, this.getHeader());
  }
  */

  subscriptionList(itemsPerPage?: number, currentPage?: number) {
    if(itemsPerPage && currentPage) {
      return this.http.get(`${this.serverUrl}/subscriptions?itemsPerPage=${itemsPerPage}&currentPage=${currentPage}`);
    }
    return this.http.get(`${this.serverUrl}/subscriptions`);
  }

  createSubscription(data: any) {
    return this.http.post(`${this.serverUrl}/subscriptions`, data);
  }

  updateSubscription(id: any, data: any) {
    return this.http.put(`${this.serverUrl}/subscriptions/${id}`, data);
  }

  deleteSubscription(id: any) {
    return this.http.delete(`${this.serverUrl}/subscriptions/${id}`);
  }

  getSubscriptionDataUsage(subscriptionId: string) {
    return this.http.get(`${this.serverUrl}/activation/data-usage/${subscriptionId}`);
  }

  getPlans() {
    return this.http.get(`${this.serverUrl}/subscription/plans`);
  }

  getRefund(subscriptionId: string) {
    return this.http.get(`${this.serverUrl}/subscription/refund/${subscriptionId}`);
  }
}
