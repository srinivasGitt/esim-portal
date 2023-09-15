import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { DialogComponent } from '../../service/dialog';

@Component({
  selector: 'app-subscription-refund',
  templateUrl: './subscription-refund.component.html',
  styleUrls: ['./subscription-refund.component.scss']
})
export class SubscriptionRefundComponent implements OnInit {

  dialogRef!: DialogComponent;
  message = 'Are you sure you want to initiate refund ?'
  data: {
    title: string | undefined,
    icon: string | undefined,
    showCloseBtn: boolean | undefined,
    buttonGroup: Array<{ cssClass: string, title: string, value: boolean}>
  } = { title : undefined, icon: undefined, showCloseBtn : undefined, buttonGroup : []};

  title: string = 'Download Sample File';

  constructor(private viewContainer: ViewContainerRef) {
    const _injector = this.viewContainer.injector;
    this.dialogRef = _injector.get<DialogComponent>(DialogComponent)
  }

  ngOnInit(): void {
  }

  close(value: boolean): void {
    this.dialogRef.close.emit(value);
  }

}
