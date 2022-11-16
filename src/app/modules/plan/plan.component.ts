import { Component, OnInit } from '@angular/core';
import { ConfirmComponent } from 'src/app/shared/dialog/confirm/confirm.component';
import { PlanDialogComponent } from 'src/app/shared/dialog/plan-dialog/plan-dialog.component';
import { DialogService } from 'src/app/shared/service/dialog';
import { PlansService } from 'src/app/shared/service/plans.service';
import { AlertService } from 'src/app/shared/service/alert.service';
@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss']
})
export class PlanComponent implements OnInit {
  plansList: any = [];
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
        }
      })
  }
  getAllPlans() {
    this.plansService.listPlans()
    .subscribe(
      (data: any) => {
       
        this.plansList = data;
      }, err => {
        this.alertService.error(err.error.message);
      }
    );
  }
  editPlans(index: number) {
    this.dialogService.openModal(PlanDialogComponent, { cssClass: 'modal-md', context: {data: this.plansList[index], title: 'Edit Plan'} })
      .instance.close.subscribe((data: any) => {
        let vm  = this;
        vm.plansList[index] = data;
        }, err => {
          this.alertService.error(err.error.message);
        });
  }

  deletePlan( index: number) {
    this.dialogService.openModal(ConfirmComponent, { cssClass: 'modal-sm', context: {message: 'Are you sure want to delete this plan?'} })
    .instance.close.subscribe((data: any) => {
      const vm = this;
      if (data) {
        vm.plansService.deletePlan(vm.plansList[index]._id)
        .subscribe(res => {
          vm.plansList.splice(index, 1);
        }, err => {
          this.alertService.error(err.error.message);
        })
      }
     
      });
    }
}
