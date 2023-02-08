import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { DialogComponent } from '../../service/dialog';

@Component({
  selector: 'app-plan-info',
  templateUrl: './plan-info.component.html',
  styleUrls: ['./plan-info.component.scss']
})
export class PlanInfoComponent implements OnInit {
  dialogRef: DialogComponent;
  planDetails: any;
  
  constructor(
    private viewContainer: ViewContainerRef,
  ) {
    const _injector = this.viewContainer.injector;
    this.dialogRef = _injector.get<DialogComponent>(DialogComponent);
  }

  ngOnInit(): void {
    this.planDetails = this.dialogRef.context.data;
  }

  close(): void {
    this.dialogRef.close.emit();
  }
}
