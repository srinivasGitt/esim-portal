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
    return this.http.post(`${this.serverUrl}/customers/setting/configuration`,loyaltyData);
  }
}

