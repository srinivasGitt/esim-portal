import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js'
import { Observable, combineLatest } from 'rxjs';
import { AlertService } from 'src/app/shared/service/alert.service';
import { CustomerService } from 'src/app/shared/service/customer.service';
import { DashboardService } from 'src/app/shared/service/dashboard.service';
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

  constructor(private router: Router,
    private dashboardService: DashboardService,
    private customerService: CustomerService,
    private alertService: AlertService) {
      this.dashboardWidgets = dashboardService.getDashboardWidgets();
      dashboardService.getAppTheme().subscribe((data : any) =>{
        this.isDarkTheme = data;
        this.drawChart();
      });
  }

  ngOnInit(): void {
    if (!localStorage.getItem('authToken')) {
      this.router.navigate(['/signin']);
    }else{
      this.drawChart();
      this.getDashboardCounts();
    }

  }

  drawChart() {
    if(this.graphElement) this.graphElement.destroy();
    this.graphElement = new Chart("downloadChart", {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Previous week',
          data: [12, 19, 3, 5, 2, 3, 18],
          fill: true,
          backgroundColor: [
            '#6B6B7310'
          ],
          borderColor: [
            '#6B6B7366'
          ],
          borderWidth: 3,
          pointRadius: 0
        },
        {
          label: 'Current week',
          data: [10, 13, 2, 9, 5, 14, 16],
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
