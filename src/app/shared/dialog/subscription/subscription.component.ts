import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { DialogComponent } from '../../service/dialog';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent  implements OnInit {
  @Input() customer: any;
  dialogRef: DialogComponent
  constructor(
    private viewContainer: ViewContainerRef) {
    const _injector = this.viewContainer.injector;
    this.dialogRef = _injector.get<DialogComponent>(DialogComponent);
  }

  ngOnInit(): void {
    console.log(this.dialogRef);
  }
  close(data: any): void {
    this.dialogRef.close.emit({data: 'I am closing'});
  }
}