import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter
} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as moment from 'moment';
import { PaginationInstance } from 'ngx-pagination';
import { ReportAlertComponent } from 'src/app/shared/dialog/report-alert/report-alert.component';
import { DialogService, PlansService, SubscriptionsService } from 'src/app/shared/service';
import { ReportService } from '../../../shared/service/report.service';

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

@Component({
  selector: 'app-data-usage',
  templateUrl: './data-usage.component.html',
  styleUrls: ['./data-usage.component.scss'],
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
export class DataUsageComponent implements OnInit {

  startDate: any;
  endDate: any;
  currentDate = new Date().toISOString().slice(0, 10);
  customForm: any;
  dashboardWidgets: any;
  totalDataAllocated: any;
  totalDataUsed: any;
  totalDataRemaining: any;

  dataUsageReportList: any = [];
  regionList: any = [];
  planList: any = [];
  selectedFilter!: {month: number, year: number}; 
  currentYear!: number;
  currentMonth!: number;
  paginateConfig: PaginationInstance = {
    id: 'userListPagination',
    itemsPerPage: 20,
    currentPage: 1,
    totalItems: 0
  };
  filterConfig: any = {
    searchTerm: '',
    searchKey: 'email',
    filterBy: { key : 'created', type: 'date', value: undefined }
  };
  userDetails: any;
  customerId: any;
  inProgress: boolean = false;
  selectedPlan: any;
  selectedRegion: any;
  tooltipText: string = 'This plan is inactive, please enable the plan again to view it.'

  constructor(private reportService: ReportService,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private planService: PlansService,
    private dialogService: DialogService,
    private subscriptionService: SubscriptionsService) { }

  ngOnInit(): void {
    this.getPlanList();
    this.getRegionList();
    this.initForm();
  }

  getPlanList() {
    this.subscriptionService.getPlans()
      .subscribe((res: any) => {
        this.planList = res.data;
      })
  }

  getRegionList() {
    this.planService.getRegionList() 
      .subscribe((res: any) => {
        this.regionList = res.data;
      })
  }

  getDataUsageReport(fromDate?: any, toDate?: any, plan?: any, region?: any, itemsPerPage?: any, currentPage?: any) {
    this.inProgress = true;
    this.reportService.getDataUsageReport(fromDate, toDate, plan, region, itemsPerPage, currentPage)
      .subscribe((res: any) => {
        this.inProgress = false;
        this.dataUsageReportList = res.data;

        let totalData = res.totalData;
        this.totalDataAllocated = totalData.allocated;
        this.totalDataRemaining = totalData.remaining;
        this.totalDataUsed = totalData.used;

        this.paginateConfig.totalItems = res?.count[0]?.totalCount;
      }, err => {
        this.inProgress = false;
      });
  }

  selectTimeframe(value: any) {
    this.getDataUsageReport(value)
    this.customForm?.reset();
  }

  initForm(): void {
    this.inProgress = true;
    this.customForm = new FormGroup({
      fromDate: new FormControl<Date | null>(new Date(new Date().getFullYear(), new Date().getMonth(), 1)),
      toDate: new FormControl<Date | null>(new Date()),
    });

    let dateRangeStart = {
      value: moment(this.customForm.controls.fromDate.value).format('DD-MM-YYYY')
    };

    let dateRangeEnd = {
      value: moment(this.customForm.controls.toDate.value).format('DD-MM-YYYY')
    };

    this.dateRangeChange(dateRangeStart, dateRangeEnd);
  }

  dateRangeChange(dateRangeStart: any, dateRangeEnd: any) {
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
      this.getDataUsageReport(this.startDate, this.endDate, this.selectedPlan?.productId, this.selectedRegion?.name, this.paginateConfig.itemsPerPage, this.paginateConfig.currentPage-1)
    }, 1000);
  }

  planAndRegionChange() {
    setTimeout( ()=>{
      this.getDataUsageReport(this.startDate, this.endDate, this.selectedPlan?.productId, this.selectedRegion?.name, this.paginateConfig.itemsPerPage = 20, this.paginateConfig.currentPage = 0)
    }, 1000);
  }

  getPageNumber(event: any) {
    this.inProgress = true;
    this.paginateConfig.currentPage = event; 

    this.getDataUsageReport(this.startDate, this.endDate, this.selectedPlan?.productId, this.selectedRegion?.name, this.paginateConfig.itemsPerPage, this.paginateConfig.currentPage-1);
  }

  downloadDataUsageReport() {
    this.reportService.downloadDataUsageReport(this.startDate, this.endDate, this.selectedPlan?.productId, this.selectedRegion?.name, this.paginateConfig.itemsPerPage, this.paginateConfig.currentPage-1)
      .subscribe((res: any) => {

        if(res?.data?.length <= 0) {
          let customTitle: string = 'Info';
      
          this.dialogService.openModal(ReportAlertComponent, { cssClass: 'modal-sm', context: { title: customTitle, body: 'No data found in given date range!'} })
            .instance.close.subscribe((data: any) => {
          });
        } else {
          papa.unparse(res);
          const fileName = `dataUsageReport.csv`;
          const blob = new Blob([papa.unparse(res)], { type: 'text/plain;charset=utf-8' });
          FileSaver(blob, fileName);
        }
      });
  }
}
