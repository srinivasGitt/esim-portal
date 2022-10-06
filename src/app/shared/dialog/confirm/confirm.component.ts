import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { DialogComponent } from '../../service/dialog';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {
  message = 'Are you sure want to delete this.'
  dialogRef: DialogComponent;
  data: any;
  constructor(
    private viewContainer: ViewContainerRef) {
    const _injector = this.viewContainer.injector;
    this.dialogRef = _injector.get<DialogComponent>(DialogComponent);
  }

  ngOnInit(): void {
    this.message = this.dialogRef.context.message;
  }
  
  close(value: Boolean): void {
    this.dialogRef.close.emit(value);
  }

}
