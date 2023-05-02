import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfirmComponent, PlanDialogComponent, PlanInfoComponent } from 'src/app/shared/dialog';
import { DialogService, PlansService, AlertService } from 'src/app/shared/service';
import { PaginationInstance } from 'ngx-pagination';
import { SearchService } from 'src/app/shared/service/search/search.service';
@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss']
})
export class PlanComponent implements OnInit, OnDestroy {
  plansList: any = [];

  paginateConfig: PaginationInstance = {
    id: 'plansListPagination',
    itemsPerPage: 20,
    currentPage: 1,
    totalItems: 0
  };
  filterConfig: any = {
    searchTerm: '',
    searchKey: 'name',
    filterBy: { key : 'isActive', type: 'boolean', value: null }
  };
  inProgress: boolean = false;
  inSearch : boolean = false;

  constructor(private plansService: PlansService,
              private dialogService: DialogService,
              private alertService: AlertService,
              private _searchService: SearchService) { 
                _searchService.getResults().subscribe((results: any) => {
                  if(results) {
                    this.plansList = results?.data
                    this.paginateConfig.totalItems = results?.count[0]?.totalCount;
                    this.paginateConfig.currentPage = 1;
                    this.inSearch = true;  
                  }
                })
              }
  ngOnInit(): void {
    this.getAllPlans();
  }

  createPlan() {
    this.dialogService.openModal(PlanDialogComponent, { cssClass: 'modal-lg', context: {data: {}, title: 'Add New Plan'} })
      .instance.close.subscribe((data: any) => {
        if(data){
          let vm  = this;
          vm.plansList.push(data);
          this.alertService.success(data.message);
          this.getAllPlans()
        }
      })
  }
  getAllPlans() {
    this.inProgress = true;

    this.plansService.listPlans()
    .subscribe(
      (res: any) => {
        this.plansList = res.data;
        if(res.count) {
          this.paginateConfig.totalItems = res?.count[0]?.totalCount;
        }
        this.inProgress = false;
      }, err => {
        this.alertService.error(err.error.message, err.status);
        this.inProgress = false;
      }
    );
  }

  /*
  // edit plan
  editPlans(plan: any) {
    this.dialogService.openModal(PlanDialogComponent, { cssClass: 'modal-lg', context: {data: plan, title: 'Edit Plan'} })
      .instance.close.subscribe((data: any) => {
          if(data){
            this.plansList = this.plansList.map((p : any) => {if(p._id == plan._id) p = data; return p;});
            this.alertService.success('Plan Updated');
          }
        }, err => {
          this.alertService.error(err.error.message);
        });
  }
  */

  deletePlan( plan : any) {
    let data = {
      title: `Delete ${plan.name} Plan?`,
      icon: 'trash',
      showCloseBtn: true,
      buttonGroup: [
        { cssClass: 'btn-danger-scondary', title: 'Cancel', value: false},
        { cssClass: 'btn-danger ms-auto', title: 'Delete', value: true}
      ]
    };
    this.dialogService.openModal(ConfirmComponent, { cssClass: 'modal-sm', context: {message: 'Are you sure you want to delete this plan? This action cannot be undone.', data} })
    .instance.close.subscribe((data: any) => {
      if (data) {
        this.plansService.deletePlan(plan._id)
        .subscribe((res : any)=> {
          this.plansList = this.plansList.filter((c : any) => c._id != plan._id);
          this.alertService.success(res.messsage);
        }, err => {
          this.alertService.error(err.error.message, err.status);
        })
      }
     
    });
  }

  showPlanInfo(plan : any){
    this.dialogService.openModal(PlanInfoComponent, { cssClass: 'modal-sm', context: {data: plan} })
    .instance.close.subscribe((data: any) => {
      if(data){
        this.getAllPlans()
      }
    },
    (error : any) =>{

    });
  }

  searchRecord(searchTerm ?: any){
    if(searchTerm?.length > 2){
      this.filterConfig.searchTerm = searchTerm;
    } else {
      this.filterConfig.searchTerm = "";
    }
  }

  updatePlanStatus(plan : any){
    this.plansService.updatePlan(plan._id, {isActive: plan.isActive}).subscribe(
      (res : any) => {
        this.alertService.success(res.message);
      }
    )
  }

  getPageNumber(event: any) {
    this.inProgress = true;
    this.paginateConfig.currentPage = event; 

    /* Pagination based on searched data */
    if(this.inSearch && this._searchService.searchedTerm.length > 3) {
    this._searchService.getSearchResult('/plans', this._searchService.searchedTerm,this.paginateConfig.itemsPerPage, this.paginateConfig.currentPage-1).subscribe((result: any) => {
      this.plansList = result.data;
        this.paginateConfig.totalItems = result?.count[0]?.totalCount;
        this.inProgress = false;
    })
    } 
    /* Pagination based on all data */
    else {
      this.plansService.listPlans(this.paginateConfig.itemsPerPage, this.paginateConfig.currentPage-1)
      .subscribe(
        (res: any) => {
          this.plansList = res.data;
          this.paginateConfig.totalItems = res?.count[0]?.totalCount;
          this.inProgress = false;
        }, err => {
          this.alertService.error(err.error.message, err.status);
          this.inProgress = false;
        }
      );
    }
  }

  ngOnDestroy(): void {
    this.inSearch = false
    this._searchService.searchedTerm = ''
  }
}
