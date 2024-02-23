import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormGroupDirective, Validators } from '@angular/forms';

@Component({
  selector: 'app-step-three',
  templateUrl: './step-three.component.html',
  styleUrls: ['./step-three.component.scss'],
})
export class StepThreeComponent implements OnInit {
  @Input() formGroupName!: string;
  form!: FormGroup;
  userRoles: Array<string> = ['Admin'];
  constructor(private rootFormGroup: FormGroupDirective) {}

  ngOnInit(): void {
    this.form = this.rootFormGroup.control.get(this.formGroupName) as FormGroup;

    this.form.controls['userInvite'].get('number')?.valueChanges.subscribe((number: any) => {
      const tempNo = number?.split(' ') || [];
      if (tempNo.length === 2) {
        const countryCodeLength = tempNo[0].length + 1;
        this.form.controls['userInvite']
          .get('number')
          ?.setValidators([
            Validators.required,
            Validators.minLength(countryCodeLength + 7),
            Validators.maxLength(countryCodeLength + 15),
          ]);
        this.form.controls['userInvite'].get('phoneNumber')?.updateValueAndValidity();
      }
    });
  }
}
