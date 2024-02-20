import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Chart } from 'chart.js';
import * as moment from 'moment';
import { catchError, forkJoin, throwError } from 'rxjs';
import { DashboardService } from '../../service/dashboard.service';
@Component({
  selector: 'app-super-admin-dashboard',
  templateUrl: './super-admin-dashboard.component.html',
  styleUrls: ['./super-admin-dashboard.component.scss'],
})
export class SuperAdminDashboardComponent implements OnInit {
  customers = ['Travel Sim', 'Esimers', 'New Era Sim', 'simE', 'Hola Sim', 'eWorld', 'Fair Sim'];
  data = {
    labels: this.customers,
    datasets: [
      {
        data: [650, 590, 800, 801, 506, 505, 400],
        backgroundColor: 'rgba(99, 101, 239, 0.80)',
        borderRadius: 8,
        hoverBackgroundColor: 'rgba(99, 101, 239, 0.80)',
        barThickness: 48,
      },
    ],
  };
  graphElement: any;
  uptimeData: any;
  uptimeDataOrder: Array<string> = ['crm', 'trs', 'api'];

  platformReportsData: any;
  platformReportsDataOrderObject: any = {
    total_profile_sale: 'Total Profiles Sales',
    total_subscriber: 'Total Subscribers',
    total_active_customer: 'Total Active Customers',
    total_sales_of_trs: 'Total Sales of TRS',
    total_sales_of_webapp: 'Total Sales of Web App',
    total_sales_of_mobileapp: 'Total Sales of Mobile App',
  };

  activityLogsData: any;
  salesGraphData: any;
  range: any;
  startDate: any;
  endDate: any;
  selectedDay: string = 'All';
  isCustomRange: boolean = false;

  customForm = new FormGroup({
    fromDate: new FormControl<Date | null>(null),
    toDate: new FormControl<Date | null>(null),
  });
  currentDate = new Date().toISOString().slice(0, 10);

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.fetchAPIsData();
    this.generateChart();
  }

  fetchAPIsData() {
    forkJoin(this.dashboardService.getSuperAdminDashboardStatisticsData())
      .pipe(
        catchError((error) => {
          console.error('An error occurred:', error);
          return throwError('Something went wrong with one of the API calls');
        })
      )
      .subscribe({
        next: ([result1, result2, result3]: any) => {
          this.uptimeData = result1;
          const platformReportsDataResponse = result2;
          this.platformReportsData = this.filterObject(platformReportsDataResponse);
          this.salesGraphData = platformReportsDataResponse.sales_compare_graph;
          const activity = result3;
          this.activityLogsData = activity?.logs;
          console.log('Result from API 1:', this.uptimeData);
          console.log('Result from API 2:', this.platformReportsData);
          console.log('Result from API 3:', this.salesGraphData);
          console.log('Result from API 4:', this.activityLogsData);

          this.generateChart(this.salesGraphData);
        },
        error: (err) => {
          console.error('Error caught by subscription:', err);
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

  private generateChart(salesData?: any) {
    const salesGraphData: any = {
      labels: salesData.map((data: any) => data.title),
      datasets: [
        {
          data: salesData.map((data: any) => data.value),
          backgroundColor: 'rgba(99, 101, 239, 0.80)',
          borderRadius: 8,
          hoverBackgroundColor: 'rgba(99, 101, 239, 0.80)',
          barThickness: 48,
        },
      ],
    };
    if (this.graphElement) this.graphElement.destroy();
    this.graphElement = new Chart('salesChart', {
      type: 'bar',
      data: salesGraphData,
      options: {
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
          },
          y: {
            beginAtZero: true,
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
              padding: 12,
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

  dateRangeChange(dateRangeStart: HTMLInputElement, dateRangeEnd: HTMLInputElement) {
    if (dateRangeStart.value && dateRangeEnd.value) {
      // if (!this.customForm.valid) {
      //   return;
      // }
      this.startDate = moment(dateRangeStart.value).format('DD-MM-YYYY');
      this.endDate = moment(dateRangeEnd.value).format('DD-MM-YYYY');
      console.log(this.startDate, this.endDate);
      setTimeout(() => {
        this.getReports('custom', this.startDate, this.endDate);
      }, 1000);
    }
  }
}
