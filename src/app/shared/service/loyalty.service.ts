import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoyaltyService {

  serverUrl = environment.serverUrl;

  constructor(private http: HttpClient ) { }

  loyaltyPoints(loyaltyData:any) {
    return this.http.put(`${this.serverUrl}/customers/setting/configuration`,loyaltyData);
  }

  getLoyaltyPoints(){
    return this.http.get(`${this.serverUrl}/customers/setting/configuration`);
  }

  getLoyaltyWidgets(){
    return this.http.get(`${this.serverUrl}/loyalty-points/report`);
  }

}

