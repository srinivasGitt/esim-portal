import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { DialogComponent } from '../../service/dialog';

@Component({
  selector: 'app-successfull',
  templateUrl: './successfull.component.html',
  styleUrls: ['./successfull.component.scss']
})
export class SuccessfullComponent implements OnInit {

  title: any = "Successfully Updated";
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
