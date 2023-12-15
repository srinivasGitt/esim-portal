import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-step-one',
  templateUrl: './step-one.component.html',
  styleUrls: ['./step-one.component.scss']
})
export class StepOneComponent implements OnInit {

  @Input() formGroupName!: string;
  form!: FormGroup;

  constructor(private rootFormGroup: FormGroupDirective) { }

  ngOnInit(): void {
    this.form = this.rootFormGroup.control.get(this.formGroupName) as FormGroup;
  }

  onRadioButtonChange(selectedRadioValue: string) {
    // Handle the radio button value change here
    if(selectedRadioValue == 'fixed' || selectedRadioValue == 'percentage') {
      this.form.get('discountValue')?.setValue(0);
    }
  }

  /* increment and decrement input values */
  updateValue(controlKey: string, updateBy: string){
    if(updateBy == 'inc'){
      let incValue = isNaN(parseInt(this.form.get(controlKey)?.value)) ? 0 : parseInt(this.form.get(controlKey)?.value);
      this.form.get(controlKey)?.setValue(++incValue);
    } else if(updateBy == 'dec'){
      let decValue = isNaN(parseInt(this.form.get(controlKey)?.value)) ? 1 : parseInt(this.form.get(controlKey)?.value);
      if(--decValue > -1){
        this.form.get(controlKey)?.setValue(decValue);
      }
    }
  }
}
