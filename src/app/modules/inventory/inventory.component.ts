import { Component, OnInit } from '@angular/core';
import { PlansService } from 'src/app/shared/service/plans.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {

  constructor(private plansService: PlansService) { }
  ngOnInit(): void {
    // this.getAllPlans();
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
        // this.plansList = data;

      }, err => {
        console.log(err);
      }
    );

  }
}
