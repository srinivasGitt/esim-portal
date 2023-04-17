import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlansService {
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

  listPlans() {
    return this.http.get(`${this.serverUrl}/plans`, this.getHeader());
  }

  fetchPlansByRegion(regionId: string) {
    return this.http.get(`${this.serverUrl}/customer-plans?regionId=${regionId}`, this.getHeader());
  }
  createPlan(data: any) {
    return this.http.post(`${this.serverUrl}/plans`, data, this.getHeader());
  }

  updatePlan(id: any, data: any) {
    return this.http.put(`${this.serverUrl}/plans/${id}`, data, this.getHeader());
  }

  deletePlan(id: any) {
    return this.http.delete(`${this.serverUrl}/plans/${id}`, this.getHeader());
  }
  */

  listPlans() {
    return this.http.get(`${this.serverUrl}/plans`);
  }

  fetchPlansByRegion(regionId: string) {
    return this.http.get(`${this.serverUrl}/customer-plans?regionId=${regionId}`);
  }
  createPlan(data: any) {
    return this.http.post(`${this.serverUrl}/plans`, data);
  }

  updatePlan(id: any, data: any) {
    return this.http.put(`${this.serverUrl}/plans/${id}`, data);
  }

  deletePlan(id: any) {
    return this.http.delete(`${this.serverUrl}/plans/${id}`);
  }
}
