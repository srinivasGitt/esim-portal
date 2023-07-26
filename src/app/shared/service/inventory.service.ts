import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
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

  listInventory() {
    return this.http.get(`${this.serverUrl}/inventories`, this.getHeader());
  }

  assignProfile(data: any){
    return this.http.post(`${this.serverUrl}/customer/inventory`, data, this.getHeader())
  }

  uploadFile(file: any) {
    console.log(file)
    return this.http.post(`${this.serverUrl}/inventory/import`, file, this.getHeader());
  }
  */

  listInventory(itemsPerPage?: number, currentPage?: number) {
    if(itemsPerPage && currentPage) {
      return this.http.get(`${this.serverUrl}/inventories?itemsPerPage=${itemsPerPage}&currentPage=${currentPage}`);
    }
    return this.http.get(`${this.serverUrl}/inventories`);
  }
  
  assignProfile(data: any){
    return this.http.post(`${this.serverUrl}/customer/inventory`, data)
  }

  uploadFile(file: any) {
    console.log(file)
    return this.http.post(`${this.serverUrl}/inventory/import`, file);
  }
}
