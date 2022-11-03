import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { DialogComponent } from '../../service/dialog';


@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

  title: any = "Error Updating";
  dialogRef: DialogComponent;
  constructor(private viewContainer: ViewContainerRef) { 
    const _injector = this.viewContainer.injector;
    this.dialogRef = _injector.get<DialogComponent>(DialogComponent);
  }

  ngOnInit(): void {
  }


  close(): void {
    // this.data.amount = 343;
    this.dialogRef.close.emit();
  }

}
