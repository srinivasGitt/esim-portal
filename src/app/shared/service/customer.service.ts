import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
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

    customerList(){
      // if(customerId){
      //   return this.http.get(`${this.serverUrl}/customers?parentId=${customerId}`, this.getHeader());
      // }else{
        return this.http.get(`${this.serverUrl}/customer`, this.getHeader());
      // }
      
    }

    getSingleCustomer(customerId:any){
      return this.http.get(`${this.serverUrl}/customer/${customerId}`, this.getHeader());

    }

    createCustomer(data:any){
        return this.http.post(`${this.serverUrl}/customer`, data, this.getHeader());
    }

    updateCustomer(id: any, data: any) {
      console.log(data);
      return this.http.put(`${this.serverUrl}/customer/${id}`, data, this.getHeader());
    }

    deleteCustomer(id: any) {
      return this.http.delete(`${this.serverUrl}/customer/${id}`, this.getHeader());
    }
} 
