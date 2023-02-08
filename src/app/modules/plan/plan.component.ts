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

  editPlans(index: number) {
    this.dialogService.openModal(PlanDialogComponent, { cssClass: 'modal-md', context: {data: this.plansList[index], title: 'Edit Plan'} })
      .instance.close.subscribe((data: any) => {
          if(data){
            let vm  = this;
            vm.plansList[index] = data;
            this.alertService.success('Plan Updated');
          }
        }, err => {
          this.alertService.error(err.error.message);
        });
  }

  deletePlan( index: number) {
    let data = {
      title: `Delete ${this.plansList[index].name} Plan?`,
      icon: 'trash',
      showCloseBtn: true,
      buttonGroup: [
        { cssClass: 'btn-danger-scondary', title: 'Cancel', value: false},
        { cssClass: 'btn-danger ms-auto', title: 'Delete', value: true}
      ]
    };
    this.dialogService.openModal(ConfirmComponent, { cssClass: 'modal-sm', context: {message: 'Are you sure you want to delete this plan? This action cannot be undone.', data} })
    .instance.close.subscribe((data: any) => {
      const vm = this;
      if (data) {
        vm.plansService.deletePlan(vm.plansList[index]._id)
        .subscribe(res => {
          vm.plansList.splice(index, 1);
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
}
