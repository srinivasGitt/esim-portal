import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormGroup, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-step-two',
  templateUrl: './step-two.component.html',
  styleUrls: ['./step-two.component.scss'],
})
export class StepTwoComponent implements OnInit {
  @Input() formGroupName!: string;
  @Input() productsArray!: Array<any>;
  @Output() productsArrayHasTrueValue: EventEmitter<boolean> = new EventEmitter();
  hasTrueValue!: boolean;
  form!: FormGroup;
  selectedProducts: { [key: string]: boolean } = {}; // Object to store selected products
  constructor(private rootFormGroup: FormGroupDirective) {}

  ngOnInit(): void {
    this.form = this.rootFormGroup.control.get(this.formGroupName) as FormGroup;
    console.log(this.form);

    this.subscribeToFormControls();
  }

  subscribeToFormControls() {
    // Subscribe to value changes of each checkbox
    const productCheckboxesArray = this.form.get('products') as FormArray;
    productCheckboxesArray.controls.forEach((control, index) => {
      control.valueChanges.subscribe((checked) => {
        this.selectedProducts[this.productsArray[index].value] = checked;
        console.log(this.selectedProducts);

        // Check if any key-value pair in selectedProducts has a value of true
        this.hasTrueValue = Object.values(this.selectedProducts).some((value) => value);

        this.productsArrayHasTrueValue.emit(this.hasTrueValue);
      });
    });
  }
}
