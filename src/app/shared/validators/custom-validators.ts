import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static MatchValidator(source: string, target: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const sourceCtrl = control.get(source);
      const targetCtrl = control.get(target);

      return sourceCtrl?.value !== targetCtrl?.value ? { mismatch: true } : null;
    };
  }

  static websiteValidator(control: FormControl): { [key: string]: any } | null {
    const websitePattern =
      /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;

    if (!control.value || websitePattern.test(control.value)) {
      return null; // Valid website address
    } else {
      return { invalidWebsite: true }; // Invalid website address
    }
  }
}
