import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { DialogComponent } from '../../service/dialog';
import { AlertService, subscriberService } from '../../service';
import { SupportService } from '../../service/support.service';

@Component({
  selector: 'app-contact-support-info',
  templateUrl: './contact-support-info.component.html',
  styleUrls: ['./contact-support-info.component.scss']
})
export class ContactSupportInfoComponent implements OnInit {
  
  dialogRef: DialogComponent;
  requestDetails: any;
  detailsRow: Array<any> = [
    { title : 'Name', key : 'name', customClass: '' },
    { title : 'Email Address', key : 'email', customClass: '' },
    { title : 'Message', key : 'message', customClass: '' },
    { title : 'Status', key : 'status', customClass: '' }
  ]

  title!: string;
  copyText: string = 'Copy'
  inProgress: boolean = false;

  constructor(
    private viewContainer: ViewContainerRef,
    private supportService: SupportService,
    private alertService: AlertService
  ) {
    const _injector = this.viewContainer.injector;
    this.dialogRef = _injector.get<DialogComponent>(DialogComponent);
  }

  ngOnInit(): void {
    this.requestDetails = this.dialogRef.context.data;
    this.title = this.dialogRef.context.title;
    if(this.requestDetails?._id){
      this.getRequestDetails();
    }
  }

  getRequestDetails(){
    this.inProgress = true
    this.supportService.getContactSupportRequestById(this.requestDetails?._id).subscribe(
      (result : any) => {
        if(result?._id){
          this.requestDetails =  result;
        }
        this.inProgress = false;
      }, err => {
        this.alertService.error(err.error.message, err.status);
        this.inProgress = false;
      })
  }

  onSelect(value: string, data: any) {    
    const status = value 
    this.supportService.updateContactSupportRequestStatus(data._id, status).subscribe((res: any) => {
      if(res) {
        this.dialogRef.close.emit(res);
      }
    },
    (err : any) =>{
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
