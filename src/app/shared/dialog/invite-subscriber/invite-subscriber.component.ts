import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { DialogComponent } from '../../service/dialog';
import { subscriberService } from '../../service/subscriber.service';
import { AlertService } from '../../service/alert.service';

@Component({
  selector: 'app-invite-subscriber',
  templateUrl: './invite-subscriber.component.html',
  styleUrls: ['./invite-subscriber.component.scss']
})
export class InviteSubscriberComponent implements OnInit {
  dialogRef: DialogComponent;
  data: any;
  subscriberForm: any;
  title: string = 'Add Subscriber';
  
  constructor(private viewContainer: ViewContainerRef,
    private subscriberService : subscriberService,
    private alertService: AlertService) { const _injector = this.viewContainer.injector;
    this.dialogRef = _injector.get<DialogComponent>(DialogComponent);}

  ngOnInit(): void {
    this.data = this.dialogRef.context.data;
    this.title = this.dialogRef.context.title;
    this.inviteSubscriberForm();
  }

  inviteSubscriberForm(){
    this.subscriberForm = new UntypedFormGroup({
      email: new UntypedFormControl('', [Validators.required, Validators.email]),
      customerId: new UntypedFormControl(localStorage.getItem('customerId'))
    })
  }

  submitForm(){
    this.subscriberService.inviteSubscriber(this.subscriberForm.value)
    .subscribe((res:any)=>{
      this.dialogRef.close.emit(res);
    }, err => {
      this.alertService.error(err.error.message);
    })
  }

  close(): void {
    this.dialogRef.close.emit(this.subscriberForm.value);
  }

}
