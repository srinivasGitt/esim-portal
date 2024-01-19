import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { AlertService, subscriberService } from '../../service';
import { DialogComponent } from '../../service/dialog';

@Component({
  selector: 'app-subscriber-info',
  templateUrl: './subscriber-info.component.html',
  styleUrls: ['./subscriber-info.component.scss'],
})
export class SubscriberInfoComponent implements OnInit {
  dialogRef: DialogComponent;
  subscriberDetails: any;
  detailsRow: Array<any> = [
    { title: 'Display Name', key: 'displayName', customClass: '', display: true },
    { title: 'Email Address', key: 'email', customClass: '', display: true },
    { title: 'ICCID', key: 'iccid', customClass: '', display: true },
    { title: 'Activation Code', key: 'activationCode', customClass: '', display: true },
    { title: 'Date Created', key: 'created', customClass: '', isDate: true, display: true },
    { title: 'Active Plan', key: 'planName', customClass: '', display: true },
    { title: 'Plan Expiry', key: 'expiryDate', isDate: true, display: true },
    // { title : 'MSISDN', key : 'msisdn', customClass: '' },
    { title: 'Contact Preferences', key: 'contactPreferences', customClass: '', display: true },
    {
      title: 'Available Reward Points',
      key: 'availableRewardPoints',
      customClass: '',
      display: true,
    },
    { title: 'Used Reward Points', key: 'usedRewardPoints', customClass: '', display: true },
  ];

  copyText: string = 'Copy';
  inProgress: boolean = false;
  clientConfig: any;

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

    this.clientConfig = JSON.parse(localStorage.getItem('config')!);

    this.detailsRow.forEach((ele: any) => {
      if (ele.title === 'Available Reward Points' || ele.title === 'Used Reward Points') {
        if (
          this.clientConfig.rewardPointsEnabled &&
          this.clientConfig.rewardPointsMasterEnabled &&
          this.subscriberDetails.rewardPoints > 0
        ) {
          ele.display = true;
        } else {
          ele.display = false;
        }
      } else if (ele.title === 'Contact Preferences') {
        if (this.clientConfig.contactPreferenceEnabled) {
          ele.display = true;
        } else {
          ele.display = false;
        }
      } else {
        ele.display = true;
      }
    });

    if (this.subscriberDetails?._id) {
      this.getSubscriberDetails();
    }
  }

  getSubscriberDetails() {
    this.inProgress = true;
    this.subscriberService.getSingleSubscriber(this.subscriberDetails?._id).subscribe(
      (result: any) => {
        if (result?._id) {
          this.subscriberDetails = result;
          this.subscriberDetails.planName =
            this.subscriberDetails?.subscriptions?.length > 0
              ? this.subscriberDetails?.subscriptions[0].name
              : '';
          this.subscriberDetails.expiryDate =
            this.subscriberDetails?.subscriptions?.length > 0
              ? this.subscriberDetails?.subscriptions[0].expiryDate
              : '';
          this.subscriberDetails.isSms = this.subscriberDetails?.contactPreferences?.sms;
          this.subscriberDetails.isEmail = this.subscriberDetails?.contactPreferences?.email;
          this.subscriberDetails.availableRewardPoints = this.subscriberDetails?.rewardPoints;
          this.subscriberDetails.usedRewardPoints = this.subscriberDetails?.rewardPointsRedeemed;
          console.log(this.subscriberDetails);
        }
        this.inProgress = false;
      },
      (err) => {
        this.alertService.error(err.error.message, err.status);
        this.inProgress = false;
      }
    );
  }

  close(): void {
    this.dialogRef.close.emit();
  }

  // Copy user email
  copyToClipboard(event: MouseEvent, email: string | undefined) {
    event.preventDefault();

    if (!email) {
      return;
    }
    navigator.clipboard.writeText(email);
  }
}
