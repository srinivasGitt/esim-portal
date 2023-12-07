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

  getCurrencies() {
    return this.http.get(`${this.serverUrl}/currencies`);
  }
  
  testMail(email: any) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("email",email);
    return this.http.get(`${this.serverUrl}/customers/setting/testemail`, {params: queryParams});
  }

  saveSMTP(data: any) {
    return this.http.put(`${this.serverUrl}/customer/smtp/setup`, data);
  }
  
  saveCurrencySetup(data: any) {
    return this.http.post(`${this.serverUrl}/customers/setting/currency`, data);
  }
  
  getSMTP() {
    return this.http.get(`${this.serverUrl}/customer/smtp/setup`);
  }
  
  getCurrencySettings() {
    return this.http.get(`${this.serverUrl}/customers/setting/currency`);
  }
  
  testSMTP(data: any) {
    return this.http.post(`${this.serverUrl}/customer/smtp/setup`, data);
  }

  getAllSettings() {
    return [
      this.http.get(`${this.serverUrl}/customers/setting`),
      this.http.get(`${this.serverUrl}/customer/smtp/setup`),
      this.http.get(`${this.serverUrl}/customers/setting/currency`),
      this.http.get(`${this.serverUrl}/currencies`),
      this.http.get(`${this.serverUrl}/customers/setting/configuration`)
    ];
  }
}