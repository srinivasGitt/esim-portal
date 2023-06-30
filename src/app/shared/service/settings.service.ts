import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  serverUrl = environment.serverUrl;

  constructor(private http: HttpClient) { }

  saveSettings(data: any) {
    return this.http.post(`${this.serverUrl}/customers/setting`, data);
  }
  
  getSettings() {
    return this.http.get(`${this.serverUrl}/customers/setting`);
  }
  
  testMail(email: any) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("email",email);
    return this.http.get(`${this.serverUrl}/customers/setting/testemail`, {params: queryParams});
  }
}
