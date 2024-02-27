import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../../service';
import { AgentService } from '../../service/agent.service';
import { DialogComponent } from '../../service/dialog';
import { trimSpaceValidator } from '../../validators/trimSpaceValidator';

@Component({
  selector: 'app-invite-agent',
  templateUrl: './invite-agent.component.html',
  styleUrls: ['./invite-agent.component.scss'],
})
export class InviteAgentComponent implements OnInit {
  dialogRef: DialogComponent;
  inviteAgentForm!: FormGroup;
  title: string = 'Invite Agent';
  submitted = false;
  customerId!: string;

  constructor(
    private viewContainer: ViewContainerRef,
    private agentService: AgentService,
    private alertService: AlertService
  ) {
    const _injector = this.viewContainer.injector;
    this.dialogRef = _injector.get<DialogComponent>(DialogComponent);
  }

  ngOnInit(): void {
    this.customerId = this.dialogRef.context.customerId;
    this.initForm();
  }

  private initForm() {
    this.inviteAgentForm = new FormGroup({
      name: new FormControl(null, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(30),
        trimSpaceValidator,
      ]),
      email: new FormControl(null, [
        Validators.required,
        Validators.email,
        Validators.minLength(7),
        Validators.maxLength(254),
      ]),
      mobile: new FormControl(null, [
        Validators.required,
        Validators.minLength(7),
        Validators.maxLength(15),
      ]),
    });
  }

  submit() {
    this.submitted = true;

    if (this.inviteAgentForm.invalid) {
      return;
    }

    const agent = this.inviteAgentForm.value;
    const phoneNumberData = agent.mobile.split(' ');

    const finalAgentObj = {
      customerId: this.customerId,
      name: agent.name,
      email: agent.email,
      countryCode: phoneNumberData[0],
      mobile: phoneNumberData[1],
    };

    this.agentService.inviteAgent(finalAgentObj).subscribe({
      next: (result) => {
        this.dialogRef.close.emit(result);
      },
      error: (err) => {
        this.alertService.error(err.error.message);
      },
    });
    console.log(this.inviteAgentForm.value);
  }

  close(): void {
    this.dialogRef.close.emit();
  }
}
