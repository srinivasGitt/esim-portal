import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { DialogComponent } from '../../service/dialog';
import { AlertService, subscriberService } from '../../service';

@Component({
  selector: 'app-subscriber-info',
  templateUrl: './subscriber-info.component.html',
  styleUrls: ['./subscriber-info.component.scss']
})
export class SubscriberInfoComponent implements OnInit {

  dialogRef: DialogComponent;
  subscriberDetails: any;
  detailsRow: Array<any> = [
    { title : 'Display Name', key : 'displayName', customClass: '' },
    { title : 'Email Address', key : 'email', customClass: '' },
    { title : 'ICCID', key : 'iccid', customClass: '' },
    { title : 'Activation Code', key : 'activationCode', customClass: '' },
    { title : 'Date Created', key : 'created', customClass: '', isDate : true },
    { title : 'Active Plan', key : 'planName', customClass: '' },
    { title : 'Plan Expiry', key : 'expiryDate', isDate : true },
    { title : 'MSISDN', key : 'msisdn', customClass: '' },
  ]

  copyText: string = 'Copy'
  inProgress: boolean = false;

  constructor(
    private viewContainer: ViewContainerRef,
    private subscriberService: subscriberService,
    private alertService: AlertService
  ) {
    const _injector = this.viewContainer.injector;
    this.dialogRef = _injector.get<DialogComponent>(DialogComponent);
  }

  ngOnInit(): void {
    this.subscriberDetails = this.dialogRef.context.data;
    if(this.subscriberDetails?._id){
      this.getSubscriberDetails();
    }
  }

  getSubscriberDetails(){
    this.inProgress = true
    this.subscriberService.getSingleSubscriber(this.subscriberDetails?._id).subscribe(
      (result : any) => {
        if(result?._id){
          this.subscriberDetails =  result;
          this.subscriberDetails.planName = this.subscriberDetails?.subscriptions?.length > 0 ? this.subscriberDetails?.subscriptions[0].name : '';
          this.subscriberDetails.expiryDate = this.subscriberDetails?.subscriptions?.length > 0 ? this.subscriberDetails?.subscriptions[0].expiryDate : '';
        }
        this.inProgress = false;
      }, err => {
        this.alertService.error(err.error.message, err.status);
        this.inProgress = false;
      })
  }

  close(): void {
    this.dialogRef.close.emit();
  }

  // Copy user email
  copyToClipboard(event: MouseEvent, email: string | undefined) {
    event.preventDefault();

    if(!email) {
      return;
    }
    navigator.clipboard.writeText(email);
  }
}
