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
        return this.http.get(`${this.serverUrl}/customer`, this.getHeader());
    }

    createCustomer(data:any){
       return this.http.post(`${this.serverUrl}/customer`, data, this.getHeader());
    }
} 
