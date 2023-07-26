import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupportService {

  serverUrl = environment.serverUrl;

  constructor(private http: HttpClient) { }

  getAllContactSupportRequests(type: string, itemsPerPage?: number, currentPage?: number) {
    if(itemsPerPage && currentPage) {
      return this.http.get(`${this.serverUrl}/support-request?type=${type}&itemsPerPage=${itemsPerPage}&currentPage=${currentPage}`);
    }

    return this.http.get(`${this.serverUrl}/support-request?type=${type}`);
  }
  
  getContactSupportRequestById(requestId: string) {
    return this.http.get(`${this.serverUrl}/support-request/${requestId}`);
  }
  
  updateContactSupportRequestStatus(requestId: string, statusValue: string) {
    return this.http.put(`${this.serverUrl}/support-request/${requestId}`, { status: statusValue});
  }

}
