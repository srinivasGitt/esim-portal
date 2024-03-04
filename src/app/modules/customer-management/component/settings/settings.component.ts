import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  selectedItem!: string;
  customer!: string;
  accessibility!: boolean;
  connectivity!: boolean;
  checkboxForm: any;
  editMode!: boolean;
  isAnyChecked: any;
  changesMade!: boolean;
  originalFormValue: any;
  numberOfUsers = 0;
  showUserInput: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  //flags//
  inProgress: boolean = false;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((res: any) => {
      this.customer = res.id;
      console.log(res);
    });
    console.log('hi');
    this.selectItem('item1');

    this.checkboxForm = this.fb.group({
      checkbox1: new FormControl({ value: false, disabled: true }),
      checkbox2: new FormControl({ value: false, disabled: true }),
      checkbox3: new FormControl({ value: false, disabled: true }),
      checkbox4: new FormControl({ value: false, disabled: true }),
      numberOfUsers: new FormControl(this.numberOfUsers),
    });

    this.originalFormValue = this.checkboxForm.value;
    this.checkboxForm.valueChanges.subscribe(() => {
      this.isAnyChecked =
        this.checkboxForm.get('checkbox1').value ||
        this.checkboxForm.get('checkbox2').value ||
        this.checkboxForm.get('checkbox3').value ||
        this.checkboxForm.get('checkbox4').value;
      this.changesMade = true;
    });
    // this.originalFormValue = this.checkboxForm.value;

    // // Subscribe to value changes of the checkboxes
    // this.checkboxForm.get('checkbox1').valueChanges.subscribe(() => {
    //   this.changesMade = true;
    // });
    // this.checkboxForm.get('checkbox2').valueChanges.subscribe(() => {
    //   this.changesMade = true;
    // });
  }


  selectItem(item: string) {
    this.selectedItem = item;
    if (item === 'item1') {
      this.accessibility = true;
      this.connectivity = false;
    } else if (item === 'item2') {
      this.accessibility = false;
      this.connectivity = true;
    }
  }

  toggleEditMode() {
    this.editMode = true;
    this.checkboxForm.enable();
  }


  decrementUsers() {
    if (this.numberOfUsers > 1) {
      this.numberOfUsers--;
      this.checkboxForm.get('numberOfUsers').setValue(this.numberOfUsers);
    }
  }
  incrementUsers() {
    this.numberOfUsers++;
    this.checkboxForm.get('numberOfUsers').setValue(this.numberOfUsers);
  }

  /*button functionality*/
  cancelEditMode() {
    this.editMode = false;
    this.checkboxForm.patchValue(this.originalFormValue);
    this.checkboxForm.disable();
    this.isAnyChecked = false;
    this.showUserInput = false;

  }

  saveChanges() {
    // this.editMode = false;
    // this.checkboxForm.disable();
    this.originalFormValue = this.checkboxForm.value;
    this.editMode = false;
    this.checkboxForm.disable();
    this.changesMade = false;


  }

  updateFormValidity() {
    const checkbox1Value = this.checkboxForm.get('checkbox1')?.value;
    const checkbox2Value = this.checkboxForm.get('checkbox2')?.value;
    const checkbox3Value = this.checkboxForm.get('checkbox3')?.value;
    const checkbox4Value = this.checkboxForm.get('checkbox4')?.value;
    if (checkbox1Value || checkbox2Value || checkbox3Value || checkbox4Value) {
      this.isAnyChecked = true;
      this.changesMade = true;
    } else {
      this.isAnyChecked = false;
      this.changesMade = false;
    }

    if (checkbox2Value) {
      this.showUserInput = true;
    } else {
      this.showUserInput = false;
    }
  }

  gotoSingleCustomer(customer: any) {
    this.router.navigate(['customers/', customer]);
  }

}
