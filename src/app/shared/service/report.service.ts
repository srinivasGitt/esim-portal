import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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

  getDataUsageReport(fromDate?: any, toDate?: any, body?: any, itemsPerPage?: any, currentPage?: any) {
    return this.http.post(`${this.serverUrl}/data-Usage/report?fromDate=${fromDate}&toDate=${toDate}&itemsPerPage=${itemsPerPage}&currentPage=${currentPage}`, body);
  }

  downloadDataUsageReport(fromDate?: any, toDate?: any, body?: any, itemsPerPage?: any, currentPage?: any) {
    return this.http.post(`${this.serverUrl}/data-Usage/download?fromDate=${fromDate}&toDate=${toDate}&itemsPerPage=${itemsPerPage}&currentPage=${currentPage}`, body);
  }

  getCountryAndPlanList() {
    return [
      this.http.get(`${this.serverUrl}/subscription/countries`),
      this.http.get(`${this.serverUrl}/subscription/plans`),
    ];
  }
}
