import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICustomResponse } from 'src/app/shared/models';
import { Customer } from 'src/app/shared/models/customer';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  serverUrl = environment.serverUrl;

  constructor(private http: HttpClient) {}

  // Get Country Code for Phone Input
  getCountryCode() {
    return this.http.get(`${this.serverUrl}/countries`);
  }

  // Save Customer
  saveCustomer(customerDetails: Customer): Observable<ICustomResponse> {
    return this.http.post(`${this.serverUrl}/customers`, customerDetails);
  }
}
