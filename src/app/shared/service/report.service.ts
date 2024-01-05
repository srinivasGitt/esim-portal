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

  getDataUsageReport(fromDate?: any, toDate?: any, plan?: any, country?: any, itemsPerPage?: any, currentPage?: any) {
    if(plan && country) {
      return this.http.get(`${this.serverUrl}/data-Usage/report?fromDate=${fromDate}&toDate=${toDate}&country=${country}&plan=${plan}&itemsPerPage=${itemsPerPage}&currentPage=${currentPage}`);
    } else if(plan) {
      return this.http.get(`${this.serverUrl}/data-Usage/report?fromDate=${fromDate}&toDate=${toDate}&plan=${plan}&itemsPerPage=${itemsPerPage}&currentPage=${currentPage}`);
    } else if(country) {
      return this.http.get(`${this.serverUrl}/data-Usage/report?fromDate=${fromDate}&toDate=${toDate}&country=${country}&itemsPerPage=${itemsPerPage}&currentPage=${currentPage}`);
    } else {
      return this.http.get(`${this.serverUrl}/data-Usage/report?fromDate=${fromDate}&toDate=${toDate}&itemsPerPage=${itemsPerPage}&currentPage=${currentPage}`);
    }
  }

  downloadDataUsageReport(fromDate?: any, toDate?: any, plan?: any, country?: any, itemsPerPage?: any, currentPage?: any) {
    if(plan && country) {
      return this.http.get(`${this.serverUrl}/data-Usage/download?fromDate=${fromDate}&toDate=${toDate}&country=${country}&plan=${plan}&itemsPerPage=${itemsPerPage}&currentPage=${currentPage}`);
    } else if(plan) {
      return this.http.get(`${this.serverUrl}/data-Usage/download?fromDate=${fromDate}&toDate=${toDate}&plan=${plan}&itemsPerPage=${itemsPerPage}&currentPage=${currentPage}`);
    } else if(country) {
      return this.http.get(`${this.serverUrl}/data-Usage/download?fromDate=${fromDate}&toDate=${toDate}&country=${country}&itemsPerPage=${itemsPerPage}&currentPage=${currentPage}`);
    } else {
      return this.http.get(`${this.serverUrl}/data-Usage/download?fromDate=${fromDate}&toDate=${toDate}&itemsPerPage=${itemsPerPage}&currentPage=${currentPage}`);
    }
  }
}
