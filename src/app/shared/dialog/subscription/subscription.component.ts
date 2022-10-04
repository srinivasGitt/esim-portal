import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogComponent } from '../../service/dialog';

@Component({
  selector: 'app-dialog-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionDialogComponent  implements OnInit {
  dialogRef: DialogComponent;
  data: any;
  subscriptionForm: any;
  title: string = 'Add Subscription';
  constructor(
    private viewContainer: ViewContainerRef) {
    const _injector = this.viewContainer.injector;
    this.dialogRef = _injector.get<DialogComponent>(DialogComponent);
  }
  
  
  ngOnInit(): void {
    this.data = this.dialogRef.context.data;
    this.title = this.dialogRef.context.title;
    this.createSubscriptionForm();
  }
  createSubscriptionForm() {
    console.log(this.data?.amount);
    this.subscriptionForm = new FormGroup({
      subscriptionNumber: new FormControl(this.data?.subscriptionNumber, [Validators.required]),
      amount: new FormControl(this.data?.amount, [Validators.required]),
      startDate: new FormControl(this.data?.startDate, [Validators.required]),
      endDate: new FormControl(this.data?.endDate, [Validators.required]),
      planId: new FormControl(this.data?.planId, [Validators.required]),
      userEmail: new FormControl(this.data?.userEmail, [Validators.required, Validators.email]),
    });
  }
  submit() {
    console.log(this.subscriptionForm.value);
    this.close();
  }
  close(): void {
    // this.data.amount = 343;
    this.dialogRef.close.emit(this.subscriptionForm.value);
  }
}