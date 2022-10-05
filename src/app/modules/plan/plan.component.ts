import { Component, OnInit } from '@angular/core';
import { PlanDialogComponent } from 'src/app/shared/dialog/plan-dialog/plan-dialog.component';
import { DialogService } from 'src/app/shared/service/dialog';
import { PlansService } from 'src/app/shared/service/plans.service';
@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss']
})
export class PlanComponent implements OnInit {
  plansList: any = [];
  // East Asia, Southeast Asia, South Asia, Central Asia, and West Asia
  constructor(private plansService: PlansService,
              private dialogService: DialogService) { }
  ngOnInit(): void {
    this.getAllPlans();
  }

  createPlan() {
    this.dialogService.openModal(PlanDialogComponent, { cssClass: 'modal-md', context: {data: {}, title: 'Add New Plan'} })
      .instance.close.subscribe((data: any) => {
        let vm  = this;
        vm.plansList.push(data);
        }, err => {
          console.log(err);
        });
  }
  getAllPlans() {
    this.plansService.listPlans()
    .subscribe(
      (data: any) => {
        console.log(data);
        this.plansList = data;
      }, err => {
        console.log(err);
      }
    );
  }
  editPlans(index: number) {
    this.dialogService.openModal(PlanDialogComponent, { cssClass: 'modal-md', context: {data: this.plansList[index], title: 'Edit Plan'} })
      .instance.close.subscribe((data: any) => {
        let vm  = this;
        vm.plansList[index] = data;
        }, err => {
          console.log(err);
        });
  }
}
