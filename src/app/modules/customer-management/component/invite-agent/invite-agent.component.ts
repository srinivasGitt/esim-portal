import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/shared/service';
import { DialogComponent } from 'src/app/shared/service/dialog';
import { trimSpaceValidator } from 'src/app/shared/validators/trimSpaceValidator';

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

  constructor(
    private viewContainer: ViewContainerRef,
    private alertService: AlertService
  ) {
    const _injector = this.viewContainer.injector;
    this.dialogRef = _injector.get<DialogComponent>(DialogComponent);
  }

  ngOnInit(): void {
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

    console.log(this.inviteAgentForm.value);
  }

  close(): void {
    this.dialogRef.close.emit();
  }
}
