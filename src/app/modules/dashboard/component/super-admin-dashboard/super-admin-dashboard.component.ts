import { getCurrencySymbol } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Chart } from 'chart.js';
import * as moment from 'moment';
import { Subject, catchError, forkJoin, takeUntil, throwError } from 'rxjs';
import { AlertService } from 'src/app/shared/service';
import { DashboardService } from '../../service/dashboard.service';
@Component({
  selector: 'app-super-admin-dashboard',
  templateUrl: './super-admin-dashboard.component.html',
  styleUrls: ['./super-admin-dashboard.component.scss'],
})
export class SuperAdminDashboardComponent implements OnInit, OnDestroy {
  // Define a Subject to manage the subscription
  private unsubscribe$: Subject<void> = new Subject<void>();

  // uptime properties
  uptimeData: any;
  uptimeDataOrder: Array<string> = ['crm', 'trs', 'api'];

  // activity log properties
  activityLogsData: any;

  // sales report properties & objects
  platformReportsData: any;
  platformReportsDataOrderObject: any = {
    total_profile_sale: 'Total Profiles Sales',
    total_subscriber: 'Total Subscribers',
    total_active_customer: 'Total Active Customers',
    total_sales_of_trs: 'Total Sales of TRS',
    total_sales_of_webapp: 'Total Sales of Web App',
    total_sales_of_mobileapp: 'Total Sales of Mobile App',
  };

  // Sales graph properties & form
  graphElement: any;
  salesGraphData: any;
  currentDate = new Date().toISOString().slice(0, 10);
  range: any;
  startDate: any;
  endDate: any;
  selectedDay: string = 'All';
  isCustomRange: boolean = false;
  customForm = new FormGroup({
    fromDate: new FormControl<Date | null>(null),
    toDate: new FormControl<Date | null>(null),
  });
  currency: string = 'USD';
  constructor(
    private dashboardService: DashboardService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.fetchStatisticsAndLogsAPIsData();
    this.uptimeApi();
  }

  // Uptime API
  uptimeApi() {
    this.dashboardService.getUptimeStatistics().subscribe({
      next: (response: any) => {
        this.uptimeData = response;
        console.log(typeof this.uptimeData.crm)
      },
      error: (err) => {
        console.error(err);
        this.alertService.error(err.error.message);
      },
    });
  }

  // Platform Statistics and Logs API
  fetchStatisticsAndLogsAPIsData() {
    forkJoin(this.dashboardService.getSuperAdminDashboardStatisticsData())
      .pipe(
        takeUntil(this.unsubscribe$),
        catchError((error) => {
          console.error('An error occurred:', error);
          return throwError(() => {
            this.alertService.error(error.error.message);
          });
        })
      )
      .subscribe({
        next: ([result1, result2]: any) => {
          // this.uptimeData = result1;
          const platformReportsDataResponse = result1;
          this.platformReportsData = this.filterObject(platformReportsDataResponse);
          this.salesGraphData = platformReportsDataResponse.sales_compare_graph;
          this.activityLogsData = result2;

          setTimeout(() => {
            this.generateChart(this.salesGraphData);
          }, 10);
        },
        error: (err) => {
          console.error(err);
          this.alertService.error(err.error.message);
        },
      });
  }

  // Preserve original property order
  orderOriginal() {
    return 0;
  }

  // Filter platformReportsDataResponse object
  filterObject(obj: any) {
    const newObj: any = {};
    Object.keys(obj).forEach((key) => {
      if (key !== 'sales_compare_graph') {
        newObj[key] = obj[key];
      }
    });
    return newObj;
  }

  /* Draw Chart - Start */
  private generateChart(salesData?: any) {
    if (salesData) {
      const currency = [...new Set(this.salesGraphData.map((data: any) => data.currency))][0];
      this.currency = getCurrencySymbol(String(currency), 'wide');
      const salesGraphData: any = {
        labels: salesData.map((data: any) => data.title),
        datasets: [
          {
            label: currency,
            data: salesData.map((data: any) => data.value),
            backgroundColor: 'rgba(99, 101, 239, 0.80)',
            borderRadius: 8,
            hoverBackgroundColor: 'rgba(99, 101, 239, 0.80)',
            barThickness: 48,
            unitSuffix: '%',
          },
        ],
      };
      if (this.graphElement) this.graphElement.destroy();
      this.graphElement = new Chart('salesChart', {
        type: 'bar',
        data: salesGraphData,
        options: {
          responsive: true,
          maintainAspectRatio: salesData?.length != 0,
          scales: {
            x: {
              grid: {
                display: false,
              },
              ticks: {
                color: '#6365EF',
                font: {
                  size: 17,
                  family: 'SF Pro Display',
                  weight: '400',
                  style: 'normal',
                },
                padding: 20,
              },
              title: {
                display: salesData?.length == 0,
                text: 'Customer',
                color: 'rgba(0, 0, 0, 0.55)',
                font: {
                  size: 14,
                  family: 'Inter',
                  weight: '700',
                },
              }
            },
            y: {
              beginAtZero: true,
              grid: {
                display: false,
              },
              ticks: {
                color: '#6365EF',
                font: {
                  size: salesData.length != 0 ? 17 : 0,
                  family: 'SF Pro Display',
                  weight: '400',
                  style: 'normal',
                },
                padding: salesData.length != 0 ? 12 : 14
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              backgroundColor: '#FFF',
              borderWidth: 2,
              borderColor: 'rgba(99, 101, 239, 0.10)',
              caretSize: 8,
              titleColor: '#6B6B73',
              bodyColor: '#6B6B73',
              bodyFont: {
                size: 14,
                family: 'Inter',
                weight: '700',
                style: 'normal',
              },
              bodyAlign: 'center',
              padding: 8,
              xAlign: 'center',
              yAlign: 'bottom',
              displayColors: false,
              multiKeyBackground: '#6B6B73',
              callbacks: {
                label: (context: any) => {
                  return this.currency + context.raw.toFixed(2);
                },
                title: () => '',
              },
            },
            title: {
              text: 'Sales',
              display: true,
              color: 'rgba(0, 0, 0, 0.55)',
              align: 'start',
              position: 'top',
              font: {
                size: 14,
                family: 'Inter',
                weight: '700',
              },
              padding: { bottom: 30 },
            },
          },
        },
      });
    }
  }
  /* Draw Chart - End */

  /* Draw chart based on Filter - Start */
  selectTimeframe(value: any) {
    this.getReports(value);
  }
  /* Draw chart based on Filter - End */

  /* Get reports data - Start */
  getReports(value?: any, fromDate?: any, toDate?: any) {
    this.dashboardService.getPlatformDataReportStatistics(value, fromDate, toDate).subscribe(
      (res: any) => {
        if (res) {
          const platformReportsDataResponse = res;
          this.platformReportsData = this.filterObject(platformReportsDataResponse);
          this.salesGraphData = platformReportsDataResponse.sales_compare_graph;
          setTimeout(() => {
            this.generateChart(this.salesGraphData);
          }, 10);
        }
      },
      (err) => {
        console.log(err.error.message);
      }
    );
  }
  /* Get reports data - End */

  /* Generate Graph based on Custom Date Range - Start */
  dateRangeChange(dateRangeStart: HTMLInputElement, dateRangeEnd: HTMLInputElement) {
    if (dateRangeStart.value && dateRangeEnd.value) {
      this.startDate = moment(dateRangeStart.value).format('DD-MM-YYYY');
      this.endDate = moment(dateRangeEnd.value).format('DD-MM-YYYY');
      setTimeout(() => {
        this.getReports('custom', this.startDate, this.endDate);
      }, 1000);
    }
  }
  /* Generate Graph based on Custom Date Range - End */

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
