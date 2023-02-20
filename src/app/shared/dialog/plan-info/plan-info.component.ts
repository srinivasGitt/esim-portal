import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { DialogComponent } from '../../service/dialog';
import { RegionsService } from '../../service';

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
    private regionService: RegionsService
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
    this.regionService.getCountriesByGroup(1).subscribe(
      (result : any) => {
        this.countryList = result?.length > 0 ? result : [];
      }
    )
  }

  displayContryList(){
    return this.countryList.slice(2).map((country) => country.name).join(', ');
  }
}
