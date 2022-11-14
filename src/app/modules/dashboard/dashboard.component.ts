import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js'
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

  constructor(private router: Router,
    private dashboardService: DashboardService,
    private customerService: CustomerService,
    private alertService: AlertService) { }

  ngOnInit(): void {
    if (!localStorage.getItem('authToken')) {
      this.router.navigate(['/signin']);
    }else{
      this.downloadTrendChart();
      this.totalProfileCount();
      this.getChildCustomers();
    }

  }

  downloadTrendChart() {
    const myChart = new Chart("downloadChart", {
      type: 'line',
      data: {
        labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
        datasets: [{
          label: 'Available',
          data: [12, 19, 3, 5, 2, 3, 18],
          backgroundColor: [
            '#3d44f5'
          ],
          borderColor: [
            '#3d44f5'
          ],
          borderWidth: 1,
          pointBackgroundColor: ['#3d44f5'],
          pointBorderColor: ['#3d44f5'],
        },
        {
          label: 'Installed',
          data: [10, 13, 2, 9, 5, 14, 16],
          backgroundColor: [
            '#71c6fc'
          ],
          borderColor: [
            '#71c6fc'
          ],
          borderWidth: 1,
          pointBackgroundColor: ['#71c6fc'],
          pointBorderColor: ['#71c6fc'],
        }],

      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        },
        elements: {
          line: {
            tension: 0.4  // smooth lines
          },
        },
        plugins: {
          legend: {
            labels: {
              usePointStyle: true,
              pointStyle: 'circle'
            }
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
