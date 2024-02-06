import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerStepperService } from '../../service/customer-stepper.service';

@Component({
  selector: 'app-add-edit-customer',
  templateUrl: './add-edit-customer.component.html',
  styleUrls: ['./add-edit-customer.component.scss'],
})
export class AddEditCustomerComponent implements OnInit, OnDestroy {
  customerForm!: FormGroup;

  // stepper
  currentStep: number = 0;
  stepCountArray: Array<any> = [
    { number: 1, title: 'Add Customer Details', subTitle: 'Basic details' },
    {
      number: 2,
      title: 'Allocation of Products',
      subTitle: 'Allocate the products for the customer',
    },
    { number: 3, title: 'Invite User', subTitle: 'User will be given admin access by default' },
  ];

  constructor(
    private fb: FormBuilder,
    private customerStepperService: CustomerStepperService
  ) {}

  ngOnInit(): void {
    // Initialize the current step
    this.customerStepperService.currentStep$.subscribe((step) => {
      this.currentStep = step;
    });
    this._initForm();
  }

  _initForm() {
    this.customerForm = this.fb.group({
      stepOne: this.fb.group({
        companyName: [null, [Validators.required]],
        websiteLink: [null],
        billingAddress: this.fb.group({
          addressLine: [null, [Validators.required]],
          landmark: [null],
          pincode: [null, [Validators.required]],
          city: [null, [Validators.required]],
          state: [null, [Validators.required]],
          country: [null, [Validators.required]],
        }),
        companyContactDetails: this.fb.group({
          email: [null, [Validators.required]],
          phone: [null, [Validators.required]],
        }),
      }),
      stepTwo: this.fb.group({
        allocatedProducts: [null, [Validators.required]],
      }),
      stepThree: this.fb.group({
        firstName: [null, [Validators.required]],
        lastName: [null, [Validators.required]],
        email: [null, [Validators.required]],
        phone: [null, [Validators.required]],
        role: ['admin', [Validators.required]],
      }),
    });
  }

  // Submit Customer Details
  submitCustomerDetails() {
    console.log(this.customerForm.value);
  }

  // previous step function
  previousStep(): void {
    this.customerStepperService.updateStep(this.currentStep - 1);
  }

  // next step function
  nextStep(): void {
    this.customerStepperService.updateStep(this.currentStep + 1);
  }

  /* close modal */
  cancelFormAndResetStepper(): void {
    this.customerStepperService.resetStep();
  }

  ngOnDestroy(): void {
    this.customerStepperService.resetStep();
    this.customerStepperService.currentStepNumber$.complete();
  }
}
