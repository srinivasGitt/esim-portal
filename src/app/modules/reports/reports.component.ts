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
  label: any;
  data: any;

  day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'];
  selectedDay = 'This Week';
  digit: any = ["32","90","54","90","19","53","46","21","83","87","52","29","43","16","12","37","36","27","45","48","50","76","52","16","20","27","93","88","37","12","59","14","58","40","37","46","78","50","58","36","81","61","68","47","46","74","31","40","12","35","47","86","49","90","98","74","98","11","11","59","10","35","53","28","18","49","59","33","20","66","52","48","63","70","84","29","22","58","49","21","70","35","13","69","89","40","74","20","13","50","21","68","26","39","54","10","34","72","81","26"];

  constructor(private dashboardService: DashboardService) {
    dashboardService.getAppTheme().subscribe((data : any) =>{
      console.log(data);
      if(data) {
        this.isDarkTheme = data;
      } else {
        this.isDarkTheme = true;
      }
      this.drawChart('week');
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
    this.drawChart('week');
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

  drawChart(day: any) {
    this.label = [];
    this.data = [];
    let currentDate;

    switch (day) {
      case 'week':
        currentDate = (new Date()).getDay();
        for (let i = 0; i <= currentDate; i++) {
          this.label.push(this.day[i]);
          this.data.push(this.digit[i] * 50);
          console.log(this.data);
        }
      break;
      case 'month':
        currentDate = (new Date()).getDate();
        for (let i = 1; i <= currentDate; i++) {
          this.label.push(i);
          this.data.push(this.digit[i] * 10);
        }
        break;
      case 'year':
        currentDate = (new Date()).getDate();
        this.label.push('Jan');
        this.data.push(4234);
        this.label.push('Feb');
        this.data.push(4560);
        break;
      default:
        break;
    }
    if(this.graphElement) this.graphElement.destroy();
    this.graphElement = new Chart("revenueChart", {
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
          pointRadius: 1
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
              stepSize: 100,
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
