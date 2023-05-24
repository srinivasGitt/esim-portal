import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  serverUrl = environment.serverUrl;
  authToken: string = '';

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

    childCustomers(){
      const headers = new HttpHeaders({})
      .set('Authorization', 'Bearer ' + this.authToken);
      return this.http.get(`${this.serverUrl}/customers`, this.getHeader());    
    }

    customers(){
        return this.http.get(`${this.serverUrl}/customers`, this.getHeader());
    }

    getSingleCustomer(customerId:any){
      return this.http.get(`${this.serverUrl}/customers/${customerId}`, this.getHeader());
    }

    getSubCustomer(subCustomerName:any){
      return this.http.get(`${this.serverUrl}/customers/${subCustomerName}`, this.getHeader());
    }

    createCustomer(data:any){
        return this.http.post(`${this.serverUrl}/customers`, data);
    }

    updateCustomer(id: any, data: any) {
      console.log(data);
      return this.http.put(`${this.serverUrl}/customers/${id}`, data, this.getHeader());
    }
 
    deleteCustomer(id: any) {
      return this.http.delete(`${this.serverUrl}/customers/${id}`);
    }
  */

    childCustomers(){
      const headers = new HttpHeaders({})
      .set('Authorization', 'Bearer ' + this.authToken);
      return this.http.get(`${this.serverUrl}/customers`);    
    }

    customers(){
        return this.http.get(`${this.serverUrl}/customers?dateRange=all`);
    }

    getSingleCustomer(customerId:any){
      return this.http.get(`${this.serverUrl}/customers/${customerId}`);
    }

    getSubCustomer(subCustomerName:any){
      return this.http.get(`${this.serverUrl}/customers/${subCustomerName}`);
    }

    createCustomer(data:any){
        return this.http.post(`${this.serverUrl}/customers`, data);
    }

    updateCustomer(id: any, data: any) {
      return this.http.put(`${this.serverUrl}/customers/${id}`, data);
    }

    deleteCustomer(id: any) {
      return this.http.delete(`${this.serverUrl}/customers/${id}`);
    }
} 
