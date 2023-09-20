import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { group } from 'console';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  serverUrl = environment.serverUrl;

  constructor(private http: HttpClient ) { }

  getDownloadReport(dateRangeValue?: string, fromDate?: any, toDate?: any) {
    if (dateRangeValue) {
      if(dateRangeValue === 'custom' && fromDate && toDate) {
        return this.http.get(`${this.serverUrl}/transaction/report?dateRange=${dateRangeValue}&fromDate=${fromDate}&toDate=${toDate}`)
      } else {
        return this.http.get(`${this.serverUrl}/transaction/report?dateRange=${dateRangeValue}`)
      }
    } else {
      return this.http.get(`${this.serverUrl}/transaction/report?dateRange=year`)
    }
  }

  sendTransactionAndRevenueReportMail(dateRangeValue?: string, fromDate?: any, toDate?: any) {
    if (dateRangeValue) {
      if(dateRangeValue === 'custom' && fromDate && toDate) {
        return this.http.get(`${this.serverUrl}/transaction/report/email?dateRange=${dateRangeValue}&fromDate=${fromDate}&toDate=${toDate}`)
      } else {
        return this.http.get(`${this.serverUrl}/transaction/report/email?dateRange=${dateRangeValue}`)
      }
    } else {
      return this.http.get(`${this.serverUrl}/transaction/report/email?dateRange=year`)
    }
  }
}
