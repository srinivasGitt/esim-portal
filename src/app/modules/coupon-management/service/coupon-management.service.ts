import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CouponManagementService {

  serverUrl = environment.serverUrl;

  constructor(private http: HttpClient) { }

  getDropdownData() {
    return [
      this.http.get(`${this.serverUrl}/plans`),
      // this.http.get(`${this.serverUrl}/group`),
      this.http.get(`${this.serverUrl}/countries`)
    ]
  }
}
