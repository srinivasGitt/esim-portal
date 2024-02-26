import { getCurrencySymbol } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chart } from 'chart.js';
import * as moment from 'moment';
import { combineLatest } from 'rxjs';
import {
  AlertService,
  CustomerService,
  DashboardService,
  LocalStorageService,
} from 'src/app/shared/service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  totalProfiles: any;
  customerList: any;
  dashboardDetails: any;
  dashboardWidgets!: Array<any>;
  isDarkTheme = false;
  graphElement: any;
  label: any;
  data: any;
  range: any;
  startDate: any;
  endDate: any;
  inProgress: boolean = false;
  selectedDay: string = 'All';
  selectedDayTerm: string = '';
  currencyType: string = 'USD';
  axisColor: any;
  currencySymbol: any;

  constructor(
    private router: Router,
    private dashboardService: DashboardService,
    private customerService: CustomerService,
    private alertService: AlertService,
    private _localStorageService: LocalStorageService
  ) {
    this.dashboardWidgets = dashboardService.getDashboardWidgets();

    this.dashboardWidgets.forEach((ele: any) => {
      if (ele.detailsType === 'currency') {
        this.currencySymbol = getCurrencySymbol(this.currencyType, 'wide');
      }
    });

    dashboardService.getAppTheme().subscribe((data: any) => {
      this.isDarkTheme = data;
      // this.drawChart();
    });
  }

  ngOnInit(): void {
    // this.drawChart();
    this.getReports('all');
    this.getDashboardCounts();
  }

  totalProfileCount() {
    this.dashboardService.getProfiles().subscribe((data: any) => {
      this.totalProfiles = data;
    });
  }

  getDashboardCounts() {
    this.currencyType = localStorage.getItem('currency')!;

    combineLatest(this.dashboardService.getDashboardCounts()).subscribe((result: any) => {
      this.dashboardDetails = Object.assign({}, ...result);
    });
  }

  /* Get reports data - Start */
  getReports(value?: any) {
    this.inProgress = true;
    this.dashboardService.getReports(value).subscribe(
      (res: any) => {
        if (res.result) {
          const labelData: any[] = [];
          const revenueData: any[] = [];
          this.data = res?.result;
          this.range = res?.range;
          this.startDate = this.range.startDate;
          this.endDate = this.range.endDate;

          this.data.forEach((x: any) => {
            labelData.push(x.label);
            revenueData.push(x.revenue);
          });
          // this.generateChart(labelData, revenueData, res)
          this.inProgress = false;
          setTimeout(() => {
            this.drawChart(labelData, revenueData, value);
          }, 10);
        }
      },
      (err) => {
        this.alertService.error(err.error.message);
        this.inProgress = false;
      }
    );
  }
  /* Get reports data - End */

  /* Draw Chart based on API data - Start */
  drawChart(label: any, revenue: any, timeFrameValue: string) {
    this.dashboardService.getAppTheme().subscribe((data: any) => {
      setTimeout(() => {
        const style = getComputedStyle(document.body);
        this.axisColor = style.getPropertyValue('--grpah-axis-label-color');

        this.label = [];
        this.data = [];
        let formatValue: string;

        switch (timeFrameValue) {
          case 'week':
            formatValue = 'ddd';
            break;
          case 'year':
            formatValue = 'MMM';
            break;
          default:
            formatValue = 'MMM';
        }

        for (let i = 0; i < label.length; i++) {
          let formattedLabelValue: any;
          if (
            timeFrameValue == 'month' ||
            timeFrameValue == 'all' ||
            timeFrameValue == 'previous_year' ||
            timeFrameValue == 'previous_month' ||
            timeFrameValue == 'previous_week'
          ) {
            formattedLabelValue = label[i];
          } else {
            formattedLabelValue = moment(label[i], 'DD-MM-YYYY').format(formatValue);
          }

          this.label.push(formattedLabelValue);
          this.data.push(revenue[i]);
        }

        if (this.graphElement) this.graphElement.destroy();
        this.graphElement = new Chart('downloadChart', {
          type: 'line',
          data: {
            labels: this.label,
            datasets: [
              {
                label: timeFrameValue ? timeFrameValue.toUpperCase() : 'year'.toUpperCase(),
                data: this.data,
                fill: true,
                backgroundColor: ['#6365EF10'],
                borderColor: ['#6365EF'],
                borderWidth: 1,
                pointRadius: 3,
                pointStyle: 'circle',
                tension: 0,
              },
            ],
          },
          options: {
            layout: {
              padding: 8,
            },
            scales: {
              x: {
                beginAtZero: true,
                grid: {
                  borderColor: '#00000014',
                  display: false,
                  tickWidth: 20,
                  tickLength: 30,
                },
                ticks: {
                  color: this.axisColor,
                  font: {
                    weight: '400',
                    size: 17.3639,
                    family: 'SF Pro Display',
                  },
                },
              },
              y: {
                grid: {
                  borderColor: '#00000014',
                  display: false,
                  tickWidth: 20,
                  tickLength: 20,
                },
                beginAtZero: true,
                ticks: {
                  color: this.axisColor,
                  font: {
                    weight: '400',
                    size: 17.3639,
                    family: 'SF Pro Display',
                  },
                },
                title: {
                  display: true,
                  // text: 'Revenue in $',
                  color: '#6365ef',
                },
              },
            },
            elements: {
              line: {
                tension: 0, // smooth lines
              },
            },
            plugins: {
              legend: {
                display: false,
              },
            },
          },
        });
      }, 10);
    });
  }
  /* Draw Chart based on API data - End */

  /* Draw chart based on Filter - Start */
  selectTimeframe(value: any) {
    this.getReports(value);
  }
  /* Draw chart based on Filter - End */
}
