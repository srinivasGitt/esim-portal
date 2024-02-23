import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICustomResponse } from 'src/app/shared/models';
import { Customer } from 'src/app/shared/models/customer';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CustomerModuleService {
  serverUrl = environment.serverUrl;

  constructor(private http: HttpClient) {}

  // Get Country Code for Phone Input
  getCountryCode() {
    return this.http.get(`${this.serverUrl}/countries`);
  }

  // Get Country Code for Phone Input
  getCustomersList(itemsPerPage?: number, currentPage?: number): Observable<ICustomResponse[]> {
    if (itemsPerPage && currentPage) {
      return this.http.get<ICustomResponse[]>(
        `${this.serverUrl}/customers?itemsPerPage=${itemsPerPage}&currentPage=${currentPage}`
      );
    }

    return this.http.get<ICustomResponse[]>(`${this.serverUrl}/customers`);
  }

  // Save Customer
  saveCustomer(customerDetails: Customer): Observable<ICustomResponse> {
    return this.http.post(`${this.serverUrl}/customers`, customerDetails);
  }

  // Update Customer
  updateCustomer(customerId: string, data: any): Observable<ICustomResponse> {
    return this.http.put(`${this.serverUrl}/customers/${customerId}`, data);
  }

  activateCustomer(customerId: string, data: any): Observable<ICustomResponse> {
    return this.http.put(`${this.serverUrl}/customers/${customerId}`, data);
  }

  // Get Customer by CustomerId
  getCustomerDetailsByCustomerId(customerId: string) {
    return [
      this.http.get(`${this.serverUrl}/customers/${customerId}`),
      this.http.get(`${this.serverUrl}/customers/${customerId}/statistics`),
    ];
  }
}
