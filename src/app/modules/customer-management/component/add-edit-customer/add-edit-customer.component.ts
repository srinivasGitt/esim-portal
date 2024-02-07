import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
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
  ) {
    // Initialize the current step
    this.customerStepperService.currentStep$.subscribe((step) => {
      this.currentStep = step;
    });
  }

  ngOnInit(): void {
    this._initForm();
  }

  _initForm() {
    this.customerForm = this.fb.group({
      stepOne: this.fb.group({
        companyName: [
          null,
          [Validators.required, Validators.minLength(2), Validators.maxLength(20)],
        ],
        websiteLink: [null, [CustomValidators.websiteValidator]],
        billingAddress: this.fb.group({
          addressLine: [
            null,
            [Validators.required, Validators.minLength(10), Validators.maxLength(50)],
          ],
          landmark: [null, [Validators.minLength(5), Validators.maxLength(30)]],
          pincode: [null, [Validators.required, Validators.pattern(/^[1-9][0-9]{4,19}$/)]], //PIN code could be either 5 or 20 digits long.
          city: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
          state: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
          country: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
        }),
        contactDetails: this.fb.group({
          emailAddress: [
            null,
            [
              Validators.required,
              Validators.email,
              Validators.minLength(7),
              Validators.maxLength(254),
            ],
          ],
          phoneNumber: [
            null,
            [
              Validators.required,
              Validators.pattern(/^\(?([0-9]{3})\)?[-.●]?([0-9]{3})[-.●]?([0-9]{4})$/),
              Validators.minLength(7),
              Validators.maxLength(15),
            ],
          ],
        }),
      }),
      stepTwo: this.fb.group({
        products: [null, [Validators.required]],
      }),
      stepThree: this.fb.group({
        userInvite: this.fb.group({
          firstName: [
            null,
            [Validators.required, Validators.minLength(2), Validators.maxLength(30)],
          ],
          lastName: [
            null,
            [Validators.required, Validators.minLength(2), Validators.maxLength(30)],
          ],
          email: [
            null,
            [
              Validators.required,
              Validators.email,
              Validators.minLength(3),
              Validators.maxLength(254),
            ],
          ],
          phone: [
            null,
            [
              Validators.required,
              Validators.pattern(/^\(?([0-9]{3})\)?[-.●]?([0-9]{3})[-.●]?([0-9]{4})$/),
              Validators.minLength(7),
              Validators.maxLength(15),
            ],
          ],
          role: ['admin', [Validators.required]],
        }),
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
  }
}
