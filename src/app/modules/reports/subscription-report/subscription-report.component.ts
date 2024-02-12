import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter
} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Chart, registerables } from 'chart.js';
import * as moment from 'moment';
import { ReportAlertComponent } from 'src/app/shared/dialog/report-alert/report-alert.component';
import { ReportSuccessInfoComponent } from 'src/app/shared/dialog/report-success-info/report-success-info.component';
import { DialogService, UsersService } from 'src/app/shared/service';
import { AlertService } from 'src/app/shared/service/alert.service';
import { DashboardService } from 'src/app/shared/service/dashboard.service';
import { ReportService } from 'src/app/shared/service/report.service';
var papa = require('papaparse');
var FileSaver = require('file-saver');

const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

Chart.register(...registerables)

@Component({
  selector: 'app-subscription-report',
  templateUrl: './subscription-report.component.html',
  styleUrls: ['./subscription-report.component.scss'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'en-IN'},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class SubscriptionReportComponent implements OnInit {

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
  selectedDay: string = 'All';
  currencyType: string = 'USD';
  userDetails: any;
  axisColor: any;
  disableDownloadButton = false;
  disableEmailButton = false;

  constructor(private dashboardService: DashboardService,
              private alertService: AlertService,
              private renderer: Renderer2, 
              private elementRef: ElementRef,
              private dialogService: DialogService,
              private reportService: ReportService,
              private usersService: UsersService) {
      this.dashboardWidgets = dashboardService.getDashboardWidgets();
      dashboardService.getAppTheme().subscribe((data : any) =>{
        this.isDarkTheme = data;
        // this.drawChart();
        
      });

      usersService.getCurrentUser().subscribe(result => {
        this.userDetails = result;
      });
  }
  customForm: any;

  isCustomRange: boolean = false;
  currentDate = new Date().toISOString().slice(0, 10);

  ngOnInit(): void {
      // this.drawChart();
      this.currencyType = localStorage.getItem('currency')!;
      this.initForm()
      this.getReports('all')
  }

  /* Get reports data - Start */
  getReports(value?: any, fromDate?: any, toDate?: any) {
    this.inProgress = true
    this.reportService.getSubscriptionGraphReport(value, fromDate, toDate).subscribe((res: any) => {
      if(res.result) {
        const labelData : any[] = []
        const subscriptionData : any[] = []
        this.data = res?.result;
        this.range = res?.range;

        this.data.forEach((x: any) => {
          labelData.push(x.label)
          subscriptionData.push(x.subscription)
        })
        this.inProgress = false
        setTimeout(() => {
          this.drawChart(labelData, subscriptionData, value)
        }, 10)
      }
    }, err => {
      this.alertService.error(err.error.message);
      this.inProgress = false;
    })
  }
  /* Get reports data - End */

  /* Draw Chart based on API data - Start */
  drawChart(label: any, revenue: any, timeFrameValue: string) {

    this.dashboardService.getAppTheme().subscribe((data : any) =>{
      setTimeout(() => {
        var style = getComputedStyle(document.body);
        this.axisColor = style.getPropertyValue('--grpah-axis-label-color');

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
          case 'custom':
            formatValue = 'DD MMM'
            break;
          default:
            formatValue = 'MMM'
        }
      
        for (let i = 0; i < label.length; i++) {
          let formattedLabelValue : any;
          if (timeFrameValue == 'month' || timeFrameValue == 'all' || timeFrameValue == 'last_365_days' || timeFrameValue == 'previous_month' || timeFrameValue == 'previous_week') {
            formattedLabelValue = label[i];
          } else if(timeFrameValue === 'year') {
            formattedLabelValue = moment(label[i], 'MM-yyyy').format(formatValue);
          } else {
            formattedLabelValue = moment(label[i], 'DD-MM-YYYY').format(formatValue);
          }
          
          this.label.push(formattedLabelValue);
          this.data.push(revenue[i]);
        }

        if(this.graphElement) this.graphElement.destroy();
        this.graphElement = new Chart("revenueChart", {
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
              tension: 0
            }],

          },
          options: {
            maintainAspectRatio: false,
            responsive: true,
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
                  color: this.axisColor,
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
                  color: this.axisColor,
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
                tension: 0  // smooth lines
              },
            },
            plugins: {
              legend: {
                display: false
              }
            }
          }
        });
      },10);
    })
    
  }
  /* Draw Chart based on API data - End */

  /* Draw chart based on Filter - Start */
  selectTimeframe(value: any) {
    this.getReports(value)
    this.customForm?.reset();
  }
  /* Draw chart based on Filter - End */

  initForm(): void {
    this.customForm = new FormGroup({
      fromDate: new FormControl<Date | null>(null),
      toDate: new FormControl<Date | null>(null),
    });
  }

  get f() { return this.customForm.controls; }

  dateRangeChange (dateRangeStart: HTMLInputElement, dateRangeEnd: HTMLInputElement) {
    if(!this.customForm.valid) {
      return
    }

    const spanElement = this.elementRef.nativeElement.querySelector('.mat-date-range-input-separator');
    if (spanElement) {
      this.renderer.setProperty(spanElement, 'innerHTML', 'to');
    }

    this.startDate = dateRangeStart.value
    this.endDate = dateRangeEnd.value
    setTimeout( ()=>{
      this.getReports('custom', this.startDate, this.endDate)
      }, 1000)
  }

  downloadReport() {
    let data = {
      title: `Report downloaded successfully!`,
      icon: 'trash',
      showCloseBtn: true,
      buttonGroup: [
        // { cssClass: 'btn-danger-scondary', title: 'Cancel', value: false},
        { cssClass: 'sucess-btn w-100', title: 'Close', value: true}
      ],
      message: 'Subscription report has been successfully downloaded.'
    };
    
    let timeFrame;
    switch (this.selectedDay) {
      case 'Current Week':
        timeFrame = 'week';
        break;
      case 'Current Month':
        timeFrame = 'month';
        break;
      case 'Current Year':
        timeFrame = 'year';
        break;
      case 'All':
        timeFrame = 'all';
        break;
      case 'Last 365 Days':
        timeFrame = 'last_365_days';
        break;
      case 'Last Month':
        timeFrame = 'previous_month';
        break;
      case 'Last Week':
        timeFrame = 'previous_week';
        break;
      default:
        timeFrame = 'custom';
        break;
    }

    this.disableDownloadButton = true;

    this.reportService.getSubscriptionDownloadReport(timeFrame, this.startDate, this.endDate)
      .subscribe((res: any) => {
          setTimeout(() => {
            this.disableDownloadButton = false;
          }, 10000);

          if(res && res.result.length <= 0) {
            let customTitle: string = 'Info';
        
            this.dialogService.openModal(ReportAlertComponent, { cssClass: 'modal-sm', context: { title: customTitle, body: 'No data found in given date range!'} })
              .instance.close.subscribe((data: any) => {
            });
          } else {

            this.dialogService.openModal(ReportSuccessInfoComponent, { cssClass: 'modal-sm', context: {data, message: 'Are you sure you want to initiate refund ?'} })
              .instance.close.subscribe((data: any) => {
                if(data){
                  } 
                });

            papa.unparse(res.result);
            const fileName = `SubscriptionReport.csv`;
            const blob = new Blob([papa.unparse(res.result)], { type: 'text/plain;charset=utf-8' });
            FileSaver(blob, fileName);
          }
      }, err => {
        setTimeout(() => {
          this.disableDownloadButton = false;
        }, 10000);
        this.alertService.error(err.error.message);
      });
  }

  sendSubscriptionReportEmail() {
    let data = {
      title: `Report emailed successfully!`,
      icon: 'trash',
      showCloseBtn: true,
      buttonGroup: [
        // { cssClass: 'btn-danger-scondary', title: 'Cancel', value: false},
        { cssClass: 'sucess-btn w-100', title: 'Close', value: true}
      ],
      message: `Subscription report has been successfully sent to your registered email id.`,
      email: this.userDetails.email
    };

    let timeFrame;
    switch (this.selectedDay) {
      case 'Current Week':
        timeFrame = 'week';
        break;
      case 'Current Month':
        timeFrame = 'month';
        break;
      case 'Current Year':
        timeFrame = 'year';
        break;
      case 'All':
        timeFrame = 'all';
        break;
      case 'Last 365 Days':
        timeFrame = 'last_365_days';
        break;
      case 'Last Month':
        timeFrame = 'previous_month';
        break;
      case 'Last Week':
        timeFrame = 'previous_week';
        break;
      default:
        timeFrame = 'custom';
        break;
    }

    this.disableEmailButton = true;

    this.reportService.sendSubscriptionReportEmail(timeFrame, this.startDate, this.endDate)
      .subscribe((res: any) => {
        setTimeout(() => {
          this.disableEmailButton = false;
        }, 10000);
          this.dialogService.openModal(ReportSuccessInfoComponent, { cssClass: 'modal-sm', context: {data, message: 'Are you sure you want to initiate refund ?'} })
          .instance.close.subscribe((data: any) => {
            if(data){
              } 
            });
      }, err => {
        setTimeout(() => {
          this.disableEmailButton = false;
        }, 10000);
        this.alertService.error(err.error.message);
        if(err.error.message == 'No data found in given date range!') {
          let customTitle: string = 'Info';
        
          this.dialogService.openModal(ReportAlertComponent, { cssClass: 'modal-sm', context: { title: customTitle, body: 'No data found in given date range!'} })
            .instance.close.subscribe((data: any) => {
          });
        }
      })
  }
}
