import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chart, registerables} from 'node_modules/chart.js'
Chart.register(...registerables)

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    if(!localStorage.getItem('authToken')) {
      this.router.navigate(['/signin']);
    }

    this.downloadTrendChart()
  }

  downloadTrendChart(){
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
            label: 'Others',
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
                tension : 0.4  // smooth lines
            },
          },
          plugins: {
            legend: {
              labels:{
                usePointStyle: true,
                pointStyle: 'circle'
              }
            }
          }
      }
  });
  }
}
