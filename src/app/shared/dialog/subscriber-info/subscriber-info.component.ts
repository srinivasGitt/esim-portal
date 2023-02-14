import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { DialogComponent } from '../../service/dialog';
import { subscriberService } from '../../service';

@Component({
  selector: 'app-subscriber-info',
  templateUrl: './subscriber-info.component.html',
  styleUrls: ['./subscriber-info.component.scss']
})
export class SubscriberInfoComponent implements OnInit {

  dialogRef: DialogComponent;
  subscriberDetails: any;
  detailsRow: Array<any> = [
    { title : 'Display name', key : 'displayName', customClass: '' },
    { title : 'Email address', key : 'email', customClass: '' },
    { title : 'ICCID', key : 'iccid', customClass: '' },
    { title : 'Activation Code', key : 'activationCode', customClass: 'line-height-1-5' },
    { title : 'Date Created', key : 'created', customClass: '', isDate : true },
    { title : 'Active Plan', key : 'planName', customClass: '' },
    // { title : 'Plan Expiry', key : '' },
    { title : 'MSISDN', key : 'msisdn', customClass: '' },
  ]
  constructor(
    private viewContainer: ViewContainerRef,
    private subscriberService: subscriberService
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
    this.subscriberService.getSingleSubscriber(this.subscriberDetails?._id).subscribe(
      (result : any) => {
        if(result?._id){
          this.subscriberDetails =  result;
        }
      }
    )
  }

  close(): void {
    this.dialogRef.close.emit();
  }
}
