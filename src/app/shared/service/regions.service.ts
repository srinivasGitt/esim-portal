import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { group } from 'console';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegionsService {
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

  getAllRegions() {
    return this.http.get(`${this.serverUrl}/regions`, this.getHeader());
  }

  createSubscription(data: any) {
    // data.userId = '633c417b4a43b0703742cfa3';
    return this.http.post(`${this.serverUrl}/subscriptions`, data, this.getHeader());
  }

  updateSubscription(id: any, data: any) {
    // console.log(data);
    return this.http.put(`${this.serverUrl}/subscriptions/${id}`, data, this.getHeader());
  }

  getCountriesByGroup(groupIndex : number){
    return this.http.get(`${this.serverUrl}/countries/group/${groupIndex}`, this.getHeader());
  }

  getCountries() {
    return this.http.get(`${this.serverUrl}/countries`, this.getHeader());
  }
  */

  getAllRegions() {
    return this.http.get(`${this.serverUrl}/regions`);
  }

  createSubscription(data: any) {
    return this.http.post(`${this.serverUrl}/subscriptions`, data);
  }

  updateSubscription(id: any, data: any) {
    return this.http.put(`${this.serverUrl}/subscriptions/${id}`, data);
  }

  getCountriesByGroup(groupIndex : number){
    return this.http.get(`${this.serverUrl}/countries/group/${groupIndex}`);
  }

  getCountries() {
    return this.http.get(`${this.serverUrl}/countries`);
  }
}
