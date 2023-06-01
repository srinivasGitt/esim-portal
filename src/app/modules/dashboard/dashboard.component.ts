import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js'
import { Observable, combineLatest } from 'rxjs';
import { AlertService } from 'src/app/shared/service/alert.service';
import { CustomerService } from 'src/app/shared/service/customer.service';
import { DashboardService } from 'src/app/shared/service/dashboard.service';
import { LocalStorageService } from 'src/app/shared/service/local-storage.service';
import * as moment from 'moment';

Chart.register(...registerables)

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  
  totalProfiles: any;
  customerList: any;
  dashboardDetails: any;
  dashboardWidgets!: Array<any>;
  isDarkTheme = false;
  graphElement : any;
  graphFilterBy : string = 'year';
  label: any;
  data: any;
  digit: any = ["32","90","54","90","19","53","46","21","83","87","52","29","43","16","12","37","36","27","45","48","50","76","52","16","20","27","93","88","37","12","59","14","58","40","37","46","78","50","58","36","81","61","68","47","46","74","31","40","12","35","47","86","49","90","98","74","98","11","11","59","10","35","53","28","18","49","59","33","20","66","52","48","63","70","84","29","22","58","49","21","70","35","13","69","89","40","74","20","13","50","21","68","26","39","54","10","34","72","81","26"];
  range: any;
  startDate: any;
  endDate: any;
  inProgress: boolean = false;
  selectedDay: string = 'Current Year'
  selectedDayTerm: string = '';
  
  constructor(private router: Router,
    private dashboardService: DashboardService,
    private customerService: CustomerService,
    private alertService: AlertService,
    private _localStorageService: LocalStorageService) {
      this.dashboardWidgets = dashboardService.getDashboardWidgets();
      dashboardService.getAppTheme().subscribe((data : any) =>{
        this.isDarkTheme = data;
        // this.drawChart();
        
      });
  }

  ngOnInit(): void {
      // this.drawChart();
      this.getReports('year')
      this.getDashboardCounts();
  }
/*
  drawChart() {
    this.label = [];
    this.data = [];
    let currentDate = (new Date()).getDate();
    for (let i = 1; i <= currentDate; i++) {
      this.label.push(i);
      this.data.push(this.digit[i] * 10);
    }

    if(this.graphElement) this.graphElement.destroy();
    this.graphElement = new Chart("downloadChart", {
      type: 'line',
      data: {
        labels: this.label,
        datasets: [
        {
          label: 'Current week',
          data: this.data,
          fill: true,
          backgroundColor: [
            '#6365EF10'
          ],
          borderColor: [
            '#6365EF'
          ],
          borderWidth: 3,
          pointRadius: 0
        }],

      },
      options: {
        layout:{
          padding: 20
        },
        scales: {
          x: {
            grid: {
              borderColor: '#00000014',
              display:false,
              tickWidth: 20,
              tickLength: 30
            },
            ticks:{
              color: this.isDarkTheme ? '#6365ef' : '#ffffff',
              font: {
                size : 16,
                weight: 'bold'
              }
            }
          },
          y: {
            grid: {
              borderColor: '#00000014',
              display:false,
              tickWidth: 20,
              tickLength: 20
            },
            beginAtZero: true,
            ticks:{
              color: this.isDarkTheme ? '#6365ef' : '#ffffff',
              font: {
                size : 16,
                weight: 'bold',
              }
            },
            title: {
              display: true,
              text: 'Revenue in $',
              color: this.isDarkTheme ? '#6365ef' : '#ffffff'
            }
          }
        },
        elements: {
          line: {
            tension: 0.4  // smooth lines
          },
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }
*/
  totalProfileCount() {
    this.dashboardService.getProfiles()
      .subscribe((data: any) => {
        this.totalProfiles = data;
      })
  }

  getDashboardCounts(){
    combineLatest(this.dashboardService.getDashboardCounts()).subscribe(
      ( result : any) => {
        this.dashboardDetails = Object.assign( {}, ...result);
      }
    )
  }

  getChildCustomers() {
    this.customerService.childCustomers()
     .subscribe(
      (data: any) => {
        this.customerList = data;
     }, err => {
      this.alertService.error(err.error.message);
      }
   );
  }

  /* Get reports data - Start */
  getReports(value?: any) {
    this.inProgress = true
    this.dashboardService.getReports(value).subscribe((res: any) => {
      if(res.result) {
        const labelData : any[] = []
        const revenueData : any[] = []
        this.data = res?.result
        this.range = res?.range
        this.startDate = this.range.startDate
        this.endDate = this.range.endDate

        this.data.forEach((x: any) => {
          labelData.push(x.label)
          revenueData.push(x.revenue)
        })
        // this.generateChart(labelData, revenueData, res)
        this.drawChart(labelData, revenueData, value)
        this.inProgress = false
      }
    }, err => {
      this.alertService.error(err.error.message);
      this.inProgress = false;
    })
  }
  /* Get reports data - End */

  /* Draw Chart based on API data - Start */
  drawChart(label: any, revenue: any, timeFrameValue: string) {
    this.label = [];
    this.data = [];
    let formatValue: string;

    switch(timeFrameValue) {
      case 'week':
        formatValue = 'ddd'
        break;
      case 'year':
        formatValue = 'MMM'
        break;
      default:
        formatValue = 'MMM'
    }
  
    for (let i = 0; i < label.length; i++) {
      let formattedLabelValue : any = timeFrameValue != 'month' ? moment(label[i], 'DD-MM-YYYY').format(formatValue) : label[i]
      this.label.push(formattedLabelValue);
      this.data.push(revenue[i]);
    }

    if(this.graphElement) this.graphElement.destroy();
    this.graphElement = new Chart("downloadChart", {
      type: 'line',
      data: {
        labels: this.label,
        datasets: [
        {
          label: timeFrameValue ? timeFrameValue.toUpperCase() : ('year').toUpperCase(),
          data: this.data,
          fill: true,
          backgroundColor: [
            '#6365EF10'
          ],
          borderColor: [
            '#6365EF'
          ],
          borderWidth: 1,
          pointRadius: 3,
          pointStyle: 'circle',
          tension: 0.3
        }],

      },
      options: {
        layout:{
          padding: 8
        },
        scales: {
          x: {
            beginAtZero: true,
            grid: {
              borderColor: '#00000014',
              display:false,
              tickWidth: 20,
              tickLength: 30
            },
            ticks:{
              color: '#6365ef',
              font: {
                weight: '400',
                size: 17.3639,
                family: 'SF Pro Display'
              }
            },
          },
          y: {
            grid: {
              borderColor: '#00000014',
              display:false,
              tickWidth: 20,
              tickLength: 20
            },
            beginAtZero: true,
            ticks:{
              color: '#6365ef',
              font: {
                weight: '400',
                size: 17.3639,
                family: 'SF Pro Display'
              }
            },
            title: {
              display: true,
              // text: 'Revenue in $',
              color: '#6365ef'
            }
          }
        },
        elements: {
          line: {
            tension: 0.4  // smooth lines
          },
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }
  /* Draw Chart based on API data - End */

  /* Draw chart based on Filter - Start */
  selectTimeframe(value: any) {
    this.getReports(value)
  }
  /* Draw chart based on Filter - End */
}
