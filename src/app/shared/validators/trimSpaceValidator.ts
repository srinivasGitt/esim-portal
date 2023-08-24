import { AbstractControl, ValidationErrors } from '@angular/forms';

export function trimSpaceValidator(control: AbstractControl): ValidationErrors | null {
  if (control.value && control.value.trim().length === 0) {
    return { spacesOnly: true };
  }
  return null;
}
