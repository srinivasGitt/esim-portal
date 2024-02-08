import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as moment from 'moment';
import { PaginationInstance } from 'ngx-pagination';
import { combineLatest } from 'rxjs';
import { ReportAlertComponent } from 'src/app/shared/dialog/report-alert/report-alert.component';
import { ReportSuccessInfoComponent } from 'src/app/shared/dialog/report-success-info/report-success-info.component';
import { AlertService, DialogService, PlansService, SubscriptionsService } from 'src/app/shared/service';
import { ReportService } from '../../../shared/service/report.service';

const papa = require('papaparse');
const FileSaver = require('file-saver');

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
    { provide: MAT_DATE_LOCALE, useValue: 'en-IN' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
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
  selectedFilter!: { month: number; year: number };
  currentYear!: number;
  currentMonth!: number;
  paginateConfig: PaginationInstance = {
    id: 'userListPagination',
    itemsPerPage: 20,
    currentPage: 1,
    totalItems: 0,
  };
  filterConfig: any = {
    searchTerm: '',
    searchKey: 'email',
    filterBy: { key: 'created', type: 'date', value: undefined },
  };
  userDetails: any;
  customerId: any;
  inProgress: boolean = false;
  selectedPlans: any;
  selectedRegions: any;
  tooltipText: string = 'This plan is inactive, please enable the plan again to view it.';
  regionPlaceholderString = 'Region/Country';
  planPlaceholderString = 'Plan';
  isRegionDropDownOpen = false;
  isPlanDropDownOpen = false;
  disableDownloadButton = false;

  constructor(
    private reportService: ReportService,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private planService: PlansService,
    private dialogService: DialogService,
    private subscriptionService: SubscriptionsService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.getCountryAndPlanList();
    this.initForm();
  }

  toggleRegionDropdownClass() {
    // setTimeout(() => {
    if (document.getElementById('region')?.classList.contains('ng-select-opened')) {
      this.isRegionDropDownOpen = true;
    } else {
      this.isRegionDropDownOpen = false;
    }
    // }, 10);
  }

  togglePlanDropdownClass() {
    setTimeout(() => {
      if (document.getElementById('plan')?.classList.contains('ng-select-opened')) {
        this.isPlanDropDownOpen = true;
      } else {
        this.isPlanDropDownOpen = false;
      }
    }, 10);
  }

  toggleRegion() {
    if (this.isRegionDropDownOpen) {
      document.getElementById('region')?.classList.add('ng-select-opened');
    } else {
      document.getElementById('region')?.classList.remove('ng-select-opened');
    }
  }

  togglePlan() {
    if (this.isPlanDropDownOpen) {
      document.getElementById('region')?.classList.add('ng-select-opened');
    } else {
      document.getElementById('region')?.classList.remove('ng-select-opened');
    }
  }

  getCountryAndPlanList() {
    combineLatest(this.reportService.getCountryAndPlanList()).subscribe((result: any) => {
      if (result) {
        this.inProgress = false;
        this.regionList = result[0];
        this.planList = result[1];
        this.regionList = this.regionList.map((country: any) => {
          const obj = { name: country._id, group: 'country' };
          return obj;
        });
        this.planList = this.planList.data.map((plan: any) => {
          const obj = { name: plan.name, group: 'plan', productId: Number(plan.productId) };
          return obj;
        });
      }
    });
  }

  getDataUsageReport(fromDate?: any, toDate?: any, itemsPerPage?: any, currentPage?: any) {
    this.inProgress = true;

    const body = {
      country: this.selectedRegions,
      plan: this.selectedPlans,
    };

    this.reportService
      .getDataUsageReport(fromDate, toDate, body, itemsPerPage, currentPage)
      .subscribe(
        (res: any) => {
          this.inProgress = false;
          this.dataUsageReportList = res.data;

          const totalData = res.totalData;
          this.totalDataAllocated = totalData.allocated;
          this.totalDataRemaining = totalData.remaining;
          this.totalDataUsed = totalData.used;

          this.paginateConfig.totalItems = res?.count[0]?.totalCount;
        },
        (err) => {
          this.inProgress = false;
        }
      );
  }

  selectTimeframe(value: any) {
    this.getDataUsageReport(value);
    this.customForm?.reset();
  }

  initForm(): void {
    this.inProgress = true;
    this.customForm = new FormGroup({
      fromDate: new FormControl<Date | null>(
        new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      ),
      toDate: new FormControl<Date | null>(new Date()),
    });

    const dateRangeStart = {
      value: moment(this.customForm.controls.fromDate.value).format('DD-MM-YYYY'),
    };

    const dateRangeEnd = {
      value: moment(this.customForm.controls.toDate.value).format('DD-MM-YYYY'),
    };

    this.dateRangeChange(dateRangeStart, dateRangeEnd);
  }

  dateRangeChange(dateRangeStart: any, dateRangeEnd: any) {
    if (!this.customForm.valid) {
      return;
    }

    const spanElement = this.elementRef.nativeElement.querySelector(
      '.mat-date-range-input-separator'
    );
    if (spanElement) {
      this.renderer.setProperty(spanElement, 'innerHTML', 'to');
    }

    this.startDate = dateRangeStart.value;
    this.endDate = dateRangeEnd.value;
    setTimeout(() => {
      this.getDataUsageReport(
        this.startDate,
        this.endDate,
        this.paginateConfig.itemsPerPage,
        this.paginateConfig.currentPage - 1
      );
    }, 1000);
  }

  getPageNumber(event: any) {
    this.inProgress = true;
    this.paginateConfig.currentPage = event;

    this.getDataUsageReport(
      this.startDate,
      this.endDate,
      this.paginateConfig.itemsPerPage,
      this.paginateConfig.currentPage - 1
    );
  }

  downloadDataUsageReport() {
    const body = {
      country: this.selectedRegions,
      plan: this.selectedPlans,
    };

    const data = {
      title: `Report downloaded successfully!`,
      icon: 'trash',
      showCloseBtn: true,
      buttonGroup: [
        // { cssClass: 'btn-danger-scondary', title: 'Cancel', value: false},
        { cssClass: 'sucess-btn w-100', title: 'Close', value: true },
      ],
      message: 'Data usage report has been successfully downloaded.',
    };

    this.disableDownloadButton = true;

    this.reportService
      .downloadDataUsageReport(
        this.startDate,
        this.endDate,
        body,
        this.paginateConfig.itemsPerPage,
        this.paginateConfig.currentPage - 1
      )
      .subscribe((res: any) => {
        setTimeout(() => {
          this.disableDownloadButton = false;
        }, 10000);

        if (res?.data?.length <= 0) {
          const customTitle: string = 'Info';

          this.dialogService
            .openModal(ReportAlertComponent, {
              cssClass: 'modal-sm',
              context: { title: customTitle, body: 'No data found in given date range!' },
            })
            .instance.close.subscribe((data: any) => {});

            
        } else {
          this.dialogService
            .openModal(ReportSuccessInfoComponent, {
              cssClass: 'modal-sm',
              context: { data, message: 'Report is successfully downloaded' },
            })
            .instance.close.subscribe((data: any) => {
              if (data) {
              }
            });

          papa.unparse(res);
          const fileName = `dataUsageReport.csv`;
          const blob = new Blob([papa.unparse(res)], { type: 'text/plain;charset=utf-8' });
          FileSaver(blob, fileName);
        }
      }, err => {
        setTimeout(() => {
          this.disableDownloadButton = false;
        }, 10000);
        this.alertService.error(err.error.message);
      });
  }

  selectedRegionValues(event: any) {
    if (!event.isTrusted) {
      const selectedRegions = event.map((item: any) => item.name);
      this.selectedRegions = selectedRegions;
      this.getDataUsageReport(
        this.startDate,
        this.endDate,
        this.paginateConfig.itemsPerPage,
        this.paginateConfig.currentPage - 1
      );
    }
  }

  selectedPlanValues(event: any) {
    if (!event.isTrusted) {
      const selectedPlans = event.map((item: any) => item.productId);
      console.log(selectedPlans);
      this.selectedPlans = selectedPlans;
      this.getDataUsageReport(
        this.startDate,
        this.endDate,
        this.paginateConfig.itemsPerPage,
        this.paginateConfig.currentPage - 1
      );
    }
  }

  displayList(items: any) {
    return items
      .map((item: any) => item.name)
      .slice(1)
      .join(', ');
  }
}
