import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { DialogComponent } from '../../service/dialog';
import { AuthService, UsersService } from '../../service';
import { OtpVerification } from './otpType.model';
@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.component.html',
  styleUrls: ['./otp-verification.component.scss']
})
export class OtpVerificationComponent implements OnInit {

  dialogRef: DialogComponent;
  config!: OtpVerification;
  userDetails: any;
  otpError = true;
  otpValue = '';

  public settings = {
    length: 6,
    numbersOnly: true,
    timer: 60,
    timerType: 1,
    btnText: 'Resend OTP',
    errorMessage: 'The OTP you have entered is invalid'
  }
  userEmail!: string;
  constructor(private viewContainer: ViewContainerRef,
    private userService: UsersService,
    private authService: AuthService
    ) {
    const _injector = this.viewContainer.injector;
    this.dialogRef = _injector.get<DialogComponent>(DialogComponent);
    userService.getCurrentUser().subscribe((userDetails) => {
      this.userDetails = userDetails;
      const mail = this.userDetails.email.split('@');
      this.userEmail = `${mail[0].substring(0, 3)}${'*'.repeat(mail[0].length - 3)}@${mail[1]}`;
      this.sendOtp();
    });
  }

  ngOnInit(): void {
  }

  close(): void {
    this.dialogRef.close.emit();
  }

  onOTPChange(value : any){
    if(value.length === this.settings.length) {
      this.otpValue = value;
      this.otpError = false;
    } else if(value === -2){
      this.sendOtp();
    }
  }
  sendOtp() {
    this.authService.validateUser(this.userDetails.email).subscribe(
      (result) => {

      },
      (error) => {

      });
  }

  validateOTP(){
    this.authService.validateOTP({ email: this.userDetails.email, otp: this.otpValue}).subscribe(
      (result) => {
        this.dialogRef.close.emit(true);
      },
      (error) => {
        this.otpError = true;
        this.settings.errorMessage = error.error.message;
      });
  }
}
