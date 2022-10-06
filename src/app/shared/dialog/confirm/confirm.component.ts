import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { DialogComponent } from '../../service/dialog';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {

  dialogRef: DialogComponent;
  data: any;
  title: string = 'Add Subscription';
  constructor(
    private viewContainer: ViewContainerRef) {
    const _injector = this.viewContainer.injector;
    this.dialogRef = _injector.get<DialogComponent>(DialogComponent);
  }

  ngOnInit(): void {
  }
  
  close(state: any): void {
    this.dialogRef.close.emit(this.data);
  }

}
