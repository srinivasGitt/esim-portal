import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js'
import { Observable, combineLatest } from 'rxjs';
import { AlertService } from 'src/app/shared/service/alert.service';
import { CustomerService } from 'src/app/shared/service/customer.service';
import { DashboardService } from 'src/app/shared/service/dashboard.service';
import { LocalStorageService } from 'src/app/shared/service/local-storage.service';
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
  graphFilterBy : string = 'day';
  label: any;
  data: any;
  digit: any = ["32","90","54","90","19","53","46","21","83","87","52","29","43","16","12","37","36","27","45","48","50","76","52","16","20","27","93","88","37","12","59","14","58","40","37","46","78","50","58","36","81","61","68","47","46","74","31","40","12","35","47","86","49","90","98","74","98","11","11","59","10","35","53","28","18","49","59","33","20","66","52","48","63","70","84","29","22","58","49","21","70","35","13","69","89","40","74","20","13","50","21","68","26","39","54","10","34","72","81","26"];

  constructor(private router: Router,
    private dashboardService: DashboardService,
    private customerService: CustomerService,
    private alertService: AlertService,
    private _localStorageService: LocalStorageService) {
      this.dashboardWidgets = dashboardService.getDashboardWidgets();
      dashboardService.getAppTheme().subscribe((data : any) =>{
        this.isDarkTheme = data;
        this.drawChart();
      });
  }

  ngOnInit(): void {
      this.drawChart();
      this.getDashboardCounts();
  }

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
}
