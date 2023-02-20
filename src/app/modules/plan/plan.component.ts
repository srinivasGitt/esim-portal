import { Component, OnInit } from '@angular/core';
import { ConfirmComponent, PlanDialogComponent, PlanInfoComponent } from 'src/app/shared/dialog';
import { DialogService, PlansService, AlertService } from 'src/app/shared/service';
import { PaginationInstance } from 'ngx-pagination';
@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss']
})
export class PlanComponent implements OnInit {
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

  constructor(private plansService: PlansService,
              private dialogService: DialogService,
              private alertService: AlertService) { }
  ngOnInit(): void {
    this.getAllPlans();
  }

  createPlan() {
    this.dialogService.openModal(PlanDialogComponent, { cssClass: 'modal-md', context: {data: {}, title: 'Add New Plan'} })
      .instance.close.subscribe((data: any) => {
        if(data){
          let vm  = this;
          vm.plansList.push(data);
          this.alertService.success('Plan Created');
        }
      })
  }
  getAllPlans() {
    this.plansService.listPlans()
    .subscribe(
      (data: any) => {
        this.plansList = data;
        this.paginateConfig.totalItems = data?.length;
      }, err => {
        this.alertService.error(err.error.message);
      }
    );
  }

  editPlans(plan: any) {
    this.dialogService.openModal(PlanDialogComponent, { cssClass: 'modal-md', context: {data: plan, title: 'Edit Plan'} })
      .instance.close.subscribe((data: any) => {
          if(data){
            this.plansList = this.plansList.map((p : any) => {if(p._id == plan._id) p = data; return p;});
            this.alertService.success('Plan Updated');
          }
        }, err => {
          this.alertService.error(err.error.message);
        });
  }

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
        .subscribe(res => {
          this.plansList = this.plansList.filter((c : any) => c._id != plan._id);
          this.alertService.success('Plan Deleted');
        }, err => {
          this.alertService.error(err.error.message);
        })
      }
     
    });
  }

  showPlanInfo(plan : any){
    this.dialogService.openModal(PlanInfoComponent, { cssClass: 'modal-md', context: {data: plan} })
    .instance.close.subscribe((data: any) => {

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
      (result : any) => {
        this.alertService.success('Plan status updated.');
      }
    )
  }
}
