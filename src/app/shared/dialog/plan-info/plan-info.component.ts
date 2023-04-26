import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { DialogComponent } from '../../service/dialog';
import { AlertService, PlansService, RegionsService } from '../../service';

@Component({
  selector: 'app-plan-info',
  templateUrl: './plan-info.component.html',
  styleUrls: ['./plan-info.component.scss']
})
export class PlanInfoComponent implements OnInit {
  dialogRef: DialogComponent;
  planDetails: any;
  countryList!: Array<any>;
  
  constructor(
    private viewContainer: ViewContainerRef,
    private regionService: RegionsService,
    private plansService: PlansService,
    private alertService: AlertService
  ) {
    const _injector = this.viewContainer.injector;
    this.dialogRef = _injector.get<DialogComponent>(DialogComponent);
  }

  ngOnInit(): void {
    this.planDetails = this.dialogRef.context.data;
    this.fetchContriesByGroup();
  }

  close(): void {
    this.dialogRef.close.emit();
  }

  fetchContriesByGroup(){
    this.regionService.getCountriesByGroup(this.planDetails.groupId).subscribe(
      (result : any) => {
        this.countryList = result?.length > 0 ? result : [];
      }
    )
  }

  displayContryList(){
    return this.countryList.slice(1).map((country) => country.name).join(', ');
  }

  updatePlanStatus(plan : any){
    this.plansService.updatePlan(plan._id, {isActive: !plan.isActive}).subscribe(
      (res : any) => {
        this.alertService.success(res.message);
        this.dialogRef.close.emit(res)
    }, err => {
      this.alertService.error(err.error.message, err.status);
    })
  }
}
