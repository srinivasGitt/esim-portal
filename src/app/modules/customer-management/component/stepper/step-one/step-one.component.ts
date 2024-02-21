import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormGroupDirective, Validators } from '@angular/forms';

@Component({
  selector: 'app-step-one',
  templateUrl: './step-one.component.html',
  styleUrls: ['./step-one.component.scss'],
})
export class StepOneComponent implements OnInit {
  @Input() formGroupName!: string;
  form!: FormGroup;

  constructor(private rootFormGroup: FormGroupDirective) {}

  ngOnInit(): void {
    this.form = this.rootFormGroup.control.get(this.formGroupName) as FormGroup;

    this.form.controls['contactDetails']
      .get('phoneNumber')
      ?.valueChanges.subscribe((phoneNumber: any) => {
        const tempNo = phoneNumber?.split(' ') || [];
        if (tempNo.length === 2) {
          const countryCodeLength = tempNo[0].length + 1;
          this.form.controls['contactDetails']
            .get('phoneNumber')
            ?.setValidators([
              Validators.required,
              Validators.minLength(countryCodeLength + 7),
              Validators.maxLength(countryCodeLength + 15),
            ]);
          this.form.controls['contactDetails'].get('phoneNumber')?.updateValueAndValidity();
        }
      });
  }
}
