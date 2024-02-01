import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';

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

  constructor() {}

  ngOnInit(): void {
    this.generateChart();
  }

  private generateChart() {
    if (this.graphElement) this.graphElement.destroy();
    this.graphElement = new Chart('salesChart', {
      type: 'bar',
      data: this.data,
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
}
