import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  serverUrl = environment.serverUrl;
  authToken: string = '';
  private customer = new Subject<any>();

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

    customers(itemsPerPage?: number, currentPage?: number) {
      if(itemsPerPage && currentPage) {
        return this.http.get(`${this.serverUrl}/customers?dateRange=year&itemsPerPage=${itemsPerPage}&currentPage=${currentPage}`);
      }
      return this.http.get(`${this.serverUrl}/customers?dateRange=year`);
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

    getFilteredCustomersList(dateRangeValue?: string, fromDate?: any, toDate?: any, itemsPerPage?: number, currentPage?: number ) {
      if(dateRangeValue) {
        if(fromDate && toDate) {
          return this.http.get(`${this.serverUrl}/customers?dateRange=${dateRangeValue}&fromDate=${fromDate}&toDate=${toDate}&itemsPerPage=${itemsPerPage}&currentPage=${currentPage}`)
        }
        else {
          return this.http.get(`${this.serverUrl}/customers?dateRange=${dateRangeValue}&itemsPerPage=${itemsPerPage}&currentPage=${currentPage}`)
        }
      }
      else {
        return this.http.get(`${this.serverUrl}/customers?dateRange=all`)
      }
    }

    sendCustomer(customer: any) {
      this.customer.next(customer);
    }
  
    getCustomer(): Observable<any[]> {
      return this.customer.asObservable();
    }

    getCustomerHierachy() {
      return this.http.get(`${this.serverUrl}/customers/hierarchy`);
    }
} 
