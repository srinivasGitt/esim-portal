import { Component, OnInit, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { DashboardService } from 'src/app/shared/service/dashboard.service';

Chart.register(...registerables)

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexStroke
} from "ng-apexcharts";
import { AlertService } from 'src/app/shared/service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
};

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
/*
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
*/

selectedDay = 'Current Year';

@ViewChild("chart") chart!: ChartComponent;
public chartOptions!: Partial<ChartOptions> | any;

inProgress: boolean = false;
range: any;
data: any;
startDate: string | null = null;
endDate: string | null = null;

constructor(private dashboardService: DashboardService, private alertService: AlertService) {
  // this.initChart();
}

  // initChart(labels: any, reports: any, range: any) {
  //   console.log(labels,reports, range)
  //   this.chartOptions = {
  //     series: [
  //       {
  //         data: reports
  //       }
  //     ],
  //     chart: {
  //       height: 350,
  //       type: "area"
  //     },
  //     dataLabels: {
  //       enabled: false
  //     },
  //     stroke: {
  //       curve: "smooth"
  //     },
  //     xaxis: {
  //       type: "datetime",
  //       categories: labels
  //     },
  //     tooltip: {
  //       x: {
  //         format: "dd/MM/yy HH:mm"
  //       }
  //     }
  //   };
  //   this.inProgress = false
  // }



  ngOnInit() {
    this.getReports()
  }

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
        this.generateChart(labelData, revenueData, res)
        this.inProgress = false
      }
    }, err => {
      this.alertService.error(err.error.message);
      this.inProgress = false;
    })
  }

  generateChart(labels: any, revenueData: any, res: any) {
    console.log(labels, revenueData)
    if(res.result){
      this.chartOptions= {
          chart: {
              height: 380,
              type: 'area',
              // zoom: {
              //     enabled: false
              // },
              toolbar: {
                  show: false
              }
          },
          colors: ['#556ee6'],
          dataLabels: {
              enabled: false,
          },
          stroke: {
              curve: 'smooth'
          },
          series: [{
              data: revenueData
          }],
          xaxis: {
            categories: labels
          }
      };
    };

  }

  drawChart(value: any) {
    this.getReports(value)
  }
}

// export const data = [
//   [1327359600000, 30.95],
//   [1327446000000, 31.34],
//   [1327532400000, 31.18],
//   [1327618800000, 31.05],
//   [1327878000000, 31.0],
//   [1327964400000, 30.95],
//   [1328050800000, 31.24],
//   [1328137200000, 31.29],
//   [1328223600000, 31.85],
//   [1328482800000, 31.86],
//   [1328569200000, 32.28],
//   [1328655600000, 32.1],
//   [1328742000000, 32.65],
//   [1328828400000, 32.21],
//   [1329087600000, 32.35],
//   [1329174000000, 32.44],
//   [1329260400000, 32.46],
//   [1329346800000, 32.86],
//   [1329433200000, 32.75],
//   [1329778800000, 32.54],
//   [1329865200000, 32.33],
//   [1329951600000, 32.97],
//   [1330038000000, 33.41],
//   [1330297200000, 33.27],
//   [1330383600000, 33.27],
//   [1330470000000, 32.89],
//   [1330556400000, 33.1],
//   [1330642800000, 33.73],
//   [1330902000000, 33.22],
//   [1330988400000, 31.99],
//   [1331074800000, 32.41],
//   [1331161200000, 33.05],
//   [1331247600000, 33.64],
//   [1331506800000, 33.56],
//   [1331593200000, 34.22],
//   [1331679600000, 33.77],
//   [1331766000000, 34.17],
//   [1331852400000, 33.82],
//   [1332111600000, 34.51],
//   [1332198000000, 33.16],
//   [1332284400000, 33.56],
//   [1332370800000, 33.71],
//   [1332457200000, 33.81],
//   [1332712800000, 34.4],
//   [1332799200000, 34.63],
//   [1332885600000, 34.46],
//   [1332972000000, 34.48],
//   [1333058400000, 34.31],
//   [1333317600000, 34.7],
//   [1333404000000, 34.31],
//   [1333490400000, 33.46],
//   [1333576800000, 33.59],
//   [1333922400000, 33.22],
//   [1334008800000, 32.61],
//   [1334095200000, 33.01],
//   [1334181600000, 33.55],
//   [1334268000000, 33.18],
//   [1334527200000, 32.84],
//   [1334613600000, 33.84],
//   [1334700000000, 33.39],
//   [1334786400000, 32.91],
//   [1334872800000, 33.06],
//   [1335132000000, 32.62],
//   [1335218400000, 32.4],
//   [1335304800000, 33.13],
//   [1335391200000, 33.26],
//   [1335477600000, 33.58],
//   [1335736800000, 33.55],
//   [1335823200000, 33.77],
//   [1335909600000, 33.76],
//   [1335996000000, 33.32],
//   [1336082400000, 32.61],
//   [1336341600000, 32.52],
//   [1336428000000, 32.67],
//   [1336514400000, 32.52],
//   [1336600800000, 31.92],
//   [1336687200000, 32.2],
//   [1336946400000, 32.23],
//   [1337032800000, 32.33],
//   [1337119200000, 32.36],
//   [1337205600000, 32.01],
//   [1337292000000, 31.31],
//   [1337551200000, 32.01],
//   [1337637600000, 32.01],
//   [1337724000000, 32.18],
//   [1337810400000, 31.54],
//   [1337896800000, 31.6],
//   [1338242400000, 32.05],
//   [1338328800000, 31.29],
//   [1338415200000, 31.05],
//   [1338501600000, 29.82],
//   [1338760800000, 30.31],
//   [1338847200000, 30.7],
//   [1338933600000, 31.69],
//   [1339020000000, 31.32],
//   [1339106400000, 31.65],
//   [1339365600000, 31.13],
//   [1339452000000, 31.77],
//   [1339538400000, 31.79],
//   [1339624800000, 31.67],
//   [1339711200000, 32.39],
//   [1339970400000, 32.63],
//   [1340056800000, 32.89],
//   [1340143200000, 31.99],
//   [1340229600000, 31.23],
//   [1340316000000, 31.57],
//   [1340575200000, 30.84],
//   [1340661600000, 31.07],
//   [1340748000000, 31.41],
//   [1340834400000, 31.17],
//   [1340920800000, 32.37],
//   [1341180000000, 32.19],
//   [1341266400000, 32.51],
//   [1341439200000, 32.53],
//   [1341525600000, 31.37],
//   [1341784800000, 30.43],
//   [1341871200000, 30.44],
//   [1341957600000, 30.2],
//   [1342044000000, 30.14],
//   [1342130400000, 30.65],
//   [1342389600000, 30.4],
//   [1342476000000, 30.65],
//   [1342562400000, 31.43],
//   [1342648800000, 31.89],
//   [1342735200000, 31.38],
//   [1342994400000, 30.64],
//   [1343080800000, 30.02],
//   [1343167200000, 30.33],
//   [1343253600000, 30.95],
//   [1343340000000, 31.89],
//   [1343599200000, 31.01],
//   [1343685600000, 30.88],
//   [1343772000000, 30.69],
//   [1343858400000, 30.58],
//   [1343944800000, 32.02],
//   [1344204000000, 32.14],
//   [1344290400000, 32.37],
//   [1344376800000, 32.51],
//   [1344463200000, 32.65],
//   [1344549600000, 32.64],
//   [1344808800000, 32.27],
//   [1344895200000, 32.1],
//   [1344981600000, 32.91],
//   [1345068000000, 33.65],
//   [1345154400000, 33.8],
//   [1345413600000, 33.92],
//   [1345500000000, 33.75],
//   [1345586400000, 33.84],
//   [1345672800000, 33.5],
//   [1345759200000, 32.26],
//   [1346018400000, 32.32],
//   [1346104800000, 32.06],
//   [1346191200000, 31.96],
//   [1346277600000, 31.46],
//   [1346364000000, 31.27],
//   [1346709600000, 31.43],
//   [1346796000000, 32.26],
//   [1346882400000, 32.79],
//   [1346968800000, 32.46],
//   [1347228000000, 32.13],
//   [1347314400000, 32.43],
//   [1347400800000, 32.42],
//   [1347487200000, 32.81],
//   [1347573600000, 33.34],
//   [1347832800000, 33.41],
//   [1347919200000, 32.57],
//   [1348005600000, 33.12],
//   [1348092000000, 34.53],
//   [1348178400000, 33.83],
//   [1348437600000, 33.41],
//   [1348524000000, 32.9],
//   [1348610400000, 32.53],
//   [1348696800000, 32.8],
//   [1348783200000, 32.44],
//   [1349042400000, 32.62],
//   [1349128800000, 32.57],
//   [1349215200000, 32.6],
//   [1349301600000, 32.68],
//   [1349388000000, 32.47],
//   [1349647200000, 32.23],
//   [1349733600000, 31.68],
//   [1349820000000, 31.51],
//   [1349906400000, 31.78],
//   [1349992800000, 31.94],
//   [1350252000000, 32.33],
//   [1350338400000, 33.24],
//   [1350424800000, 33.44],
//   [1350511200000, 33.48],
//   [1350597600000, 33.24],
//   [1350856800000, 33.49],
//   [1350943200000, 33.31],
//   [1351029600000, 33.36],
//   [1351116000000, 33.4],
//   [1351202400000, 34.01],
//   [1351638000000, 34.02],
//   [1351724400000, 34.36],
//   [1351810800000, 34.39],
//   [1352070000000, 34.24],
//   [1352156400000, 34.39],
//   [1352242800000, 33.47],
//   [1352329200000, 32.98],
//   [1352415600000, 32.9],
//   [1352674800000, 32.7],
//   [1352761200000, 32.54],
//   [1352847600000, 32.23],
//   [1352934000000, 32.64],
//   [1353020400000, 32.65],
//   [1353279600000, 32.92],
//   [1353366000000, 32.64],
//   [1353452400000, 32.84],
//   [1353625200000, 33.4],
//   [1353884400000, 33.3],
//   [1353970800000, 33.18],
//   [1354057200000, 33.88],
//   [1354143600000, 34.09],
//   [1354230000000, 34.61],
//   [1354489200000, 34.7],
//   [1354575600000, 35.3],
//   [1354662000000, 35.4],
//   [1354748400000, 35.14],
//   [1354834800000, 35.48],
//   [1355094000000, 35.75],
//   [1355180400000, 35.54],
//   [1355266800000, 35.96],
//   [1355353200000, 35.53],
//   [1355439600000, 37.56],
//   [1355698800000, 37.42],
//   [1355785200000, 37.49],
//   [1355871600000, 38.09],
//   [1355958000000, 37.87],
//   [1356044400000, 37.71],
//   [1356303600000, 37.53],
//   [1356476400000, 37.55],
//   [1356562800000, 37.3],
//   [1356649200000, 36.9],
//   [1356908400000, 37.68],
//   [1357081200000, 38.34],
//   [1357167600000, 37.75],
//   [1357254000000, 38.13],
//   [1357513200000, 37.94],
//   [1357599600000, 38.14],
//   [1357686000000, 38.66],
//   [1357772400000, 38.62],
//   [1357858800000, 38.09],
//   [1358118000000, 38.16],
//   [1358204400000, 38.15],
//   [1358290800000, 37.88],
//   [1358377200000, 37.73],
//   [1358463600000, 37.98],
//   [1358809200000, 37.95],
//   [1358895600000, 38.25],
//   [1358982000000, 38.1],
//   [1359068400000, 38.32],
//   [1359327600000, 38.24],
//   [1359414000000, 38.52],
//   [1359500400000, 37.94],
//   [1359586800000, 37.83],
//   [1359673200000, 38.34],
//   [1359932400000, 38.1],
//   [1360018800000, 38.51],
//   [1360105200000, 38.4],
//   [1360191600000, 38.07],
//   [1360278000000, 39.12],
//   [1360537200000, 38.64],
//   [1360623600000, 38.89],
//   [1360710000000, 38.81],
//   [1360796400000, 38.61],
//   [1360882800000, 38.63],
//   [1361228400000, 38.99],
//   [1361314800000, 38.77],
//   [1361401200000, 38.34],
//   [1361487600000, 38.55],
//   [1361746800000, 38.11],
//   [1361833200000, 38.59],
//   [1361919600000, 39.6]
// ];
