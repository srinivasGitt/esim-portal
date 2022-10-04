import { Component, OnInit } from '@angular/core';
import { PlansService } from 'src/app/shared/service/plans.service';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss']
})
export class PlanComponent implements OnInit {
  plansList: any = [];
  // East Asia, Southeast Asia, South Asia, Central Asia, and West Asia
  constructor(private plansService: PlansService) { }
  ngOnInit(): void {
    this.getAllPlans();
  }

  createPlan() {
    this.plansService.createPlan({})
    .subscribe( (data: any) => {
      console.log(data);
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
}
