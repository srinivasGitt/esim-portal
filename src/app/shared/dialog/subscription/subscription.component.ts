import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { DialogComponent, DialogService } from '../../service/dialog';
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
    private viewContainer: ViewContainerRef,
    private dialogService: DialogService) {
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
    this.subscriptionForm = new UntypedFormGroup({
      subscriptionNumber: new UntypedFormControl(this.data?.subscriptionNumber, [Validators.required]),
      amount: new UntypedFormControl(this.data?.amount, [Validators.required]),
      startDate: new UntypedFormControl(this.data?.startDate, [Validators.required]),
      endDate: new UntypedFormControl(this.data?.endDate, [Validators.required]),
      planId: new UntypedFormControl(this.data?.planId, [Validators.required]),
      userEmail: new UntypedFormControl('', [Validators.required, Validators.email]),
    });
  }
  submit() {
    this.close();   
    
  }
  close(): void {
    // this.data.amount = 343;
    this.dialogRef.close.emit(this.subscriptionForm.value);
  }
}