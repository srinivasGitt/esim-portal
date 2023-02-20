import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { DashboardService } from 'src/app/shared/service/dashboard.service';

Chart.register(...registerables)

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  monthsList: Array<string> = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  selectedFilter!: {month: number, year: number}; 
  endSelectedFilter!: {month: number, year: number}; 
  currentYear!: number;
  currentMonth!: number;
  endCurrentYear!: number;
  endCurrentMonth!: number;
  filterConfig: any = {
    searchTerm: '',
    searchKey: 'name',
    filterBy: { key : 'createdAt', type: 'date', value: undefined }
  };
  graphElement : any;
  graphFilterBy : string = 'day';
  isDarkTheme = false;

  constructor(private dashboardService: DashboardService) {
    dashboardService.getAppTheme().subscribe((data : any) =>{
      console.log(data);
      if(data) {
        this.isDarkTheme = data;
      } else {
        this.isDarkTheme = true;
      }
      this.drawChart();
    });
   }

  ngOnInit(): void {
    const date = new Date();
    this.selectedFilter = {
      month : date.getMonth(),
      year : date.getFullYear()
    };
    this.endSelectedFilter = {
      month : date.getMonth(),
      year : date.getFullYear()
    };
    this.currentYear = date.getFullYear();
    this.currentMonth = date.getMonth();
    this.endCurrentYear = date.getFullYear();
    this.endCurrentMonth = date.getMonth();
    this.filterConfig.filterBy.value = this.selectedFilter;
    this.drawChart();

  }

  changeCalendarValue(changeBy: string, key: string, dateType: string){
    if(dateType === 'start') {
      if( key == 'month'){
        if(changeBy == 'decrease'){
          this.selectedFilter.year = this.selectedFilter.month == 0 ? this.selectedFilter.year - 1 : this.selectedFilter.year; 
          this.selectedFilter.month = this.selectedFilter.month == 0 ? 11 : this.selectedFilter.month - 1;
        } else {
          this.selectedFilter.year = this.selectedFilter.month == 11 ?  this.selectedFilter.year + 1 : this.selectedFilter.year;
          this.selectedFilter.month = this.selectedFilter.month == 11 ? 0 : this.selectedFilter.month + 1;
        }
      } else if( key == 'year'){
        if(changeBy == 'decrease'){
          --this.selectedFilter.year;
        } else {
          ++this.selectedFilter.year;
        }
      }
      this.filterConfig.filterBy.value = this.selectedFilter;
    } else {
      if( key == 'month'){
        if(changeBy == 'decrease'){
          this.endSelectedFilter.year = this.endSelectedFilter.month == 0 ? this.endSelectedFilter.year - 1 : this.endSelectedFilter.year; 
          this.endSelectedFilter.month = this.endSelectedFilter.month == 0 ? 11 : this.endSelectedFilter.month - 1;
        } else {
          this.endSelectedFilter.year = this.endSelectedFilter.month == 11 ?  this.endSelectedFilter.year + 1 : this.endSelectedFilter.year;
          this.endSelectedFilter.month = this.endSelectedFilter.month == 11 ? 0 : this.endSelectedFilter.month + 1;
        }
      } else if( key == 'year'){
        if(changeBy == 'decrease'){
          --this.endSelectedFilter.year;
        } else {
          ++this.endSelectedFilter.year;
        }
      }
      this.filterConfig.filterBy.value = this.endSelectedFilter;
    }
    
  }

  drawChart() {
    console.log('called');
    if(this.graphElement) this.graphElement.destroy();
    this.graphElement = new Chart("revenueChart", {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
        {
          label: 'Current week',
          data: [100, 1300, 2000, 900, 500, 1400, 1600],
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
              stepSize: 500,
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

}
