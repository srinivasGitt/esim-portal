import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlansService {
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

  listPlans() {
    return this.http.get(`${this.serverUrl}/plans`, this.getHeader());
  }

  createPlan(data: any) {
    data = {
      name: 'Great',
      type: 'One time',
      dataSize: '200',
      cost: '20',
      costUnit: '450',
      validity: '28',
      description: 'Good to have',
      popular: '2' ,
      sms: 300,
      voice: 400,
      region: 'East Asia',
    }
    return this.http.post(`${this.serverUrl}/plans`, data, this.getHeader());
  }
}
