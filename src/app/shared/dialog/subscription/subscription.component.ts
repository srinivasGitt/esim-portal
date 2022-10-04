import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { DialogComponent } from '../../service/dialog';

@Component({
  selector: 'app-dialog-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionDialogComponent  implements OnInit {
  @Input() customer: any;
  dialogRef: DialogComponent;
  data: any;
  title: string = 'Add Subscription';
  constructor(
    private viewContainer: ViewContainerRef) {
    const _injector = this.viewContainer.injector;
    this.dialogRef = _injector.get<DialogComponent>(DialogComponent);
  }

  ngOnInit(): void {
    this.data = this.dialogRef.context.data;
  }
  close(state: any): void {
    this.data.amount = 343;
    this.dialogRef.close.emit(this.data);
  }
}