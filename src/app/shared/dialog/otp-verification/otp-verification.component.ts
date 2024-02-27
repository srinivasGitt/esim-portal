import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { AuthService, UsersService } from '../../service';
import { DialogComponent } from '../../service/dialog';
import { OtpVerification, otpType } from './otpType.model';
@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.component.html',
  styleUrls: ['./otp-verification.component.scss'],
})
export class OtpVerificationComponent implements OnInit {
  dialogRef: DialogComponent;
  config!: OtpVerification;
  userDetails: any;
  otpError = true;
  otpDetails: { requestId: string; otp: string; requestType: string } = {
    requestId: '',
    otp: '',
    requestType: '',
  };
  payload: any;

  public settings = {
    length: 6,
    numbersOnly: true,
    timer: 60,
    timerType: 1,
    btnText: 'Resend OTP',
    errorMessage: 'The OTP you have entered is invalid',
  };
  userEmail!: string;
  constructor(
    private viewContainer: ViewContainerRef,
    private userService: UsersService,
    private authService: AuthService
  ) {
    const _injector = this.viewContainer.injector;
    this.dialogRef = _injector.get<DialogComponent>(DialogComponent);
  }

  ngOnInit(): void {
    const indexOfS = Object.values(otpType).indexOf(this.config.type as unknown as otpType);
    this.otpDetails.requestType = Object.keys(otpType)[indexOfS];
    this.userService.getCurrentUser().subscribe((userDetails) => {
      this.userDetails = userDetails;
      const mail = this.userDetails.email.split('@');
      this.userEmail = `${mail[0].substring(0, 3)}${'*'.repeat(mail[0].length - 3)}@${mail[1]}`;
      this.sendOtp();
    });
  }

  close(): void {
    this.dialogRef.close.emit();
  }

  onOTPChange(value: any) {
    if (value.length === this.settings.length) {
      this.otpDetails.otp = value;
      this.otpError = false;
    } else if (value === -2) {
      this.sendOtp();
    }
  }
  sendOtp() {
    this.authService
      .validateUser({ requestType: this.otpDetails.requestType, payload: this.payload })
      .subscribe(
        (result: any) => {
          if (result?.data?.requestId) {
            this.otpDetails.requestId = result.data.requestId;
            this.otpError = false;
            this.settings.errorMessage = '';
          }
        },
        (error) => {
          this.otpError = true;
          this.settings.errorMessage = error.error.message;
        }
      );
  }

  verifyUser() {
    this.authService.verifyUser({ ...this.otpDetails }).subscribe(
      (result) => {
        this.dialogRef.close.emit(result);
      },
      (error) => {
        this.otpError = true;
        this.settings.errorMessage = error.error.message;
      }
    );
  }
}
// this.dialogService.openModal(OtpVerificationComponent, { context : { config: { type: otpType.CUSTOMER_ENABLE, buttonText: buttonText.enable}, payload: {}}})
