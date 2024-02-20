import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmComponent } from 'src/app/shared/dialog';
import { ICustomResponse } from 'src/app/shared/models';
import { Customer } from 'src/app/shared/models/customer';
import { AlertService, DialogService } from 'src/app/shared/service';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { CustomerStepperService } from '../../service/customer-stepper.service';
import { CustomerService } from '../../service/customer.service';
import { LocationStrategy } from '@angular/common';

@Component({
  selector: 'app-add-edit-customer',
  templateUrl: './add-edit-customer.component.html',
  styleUrls: ['./add-edit-customer.component.scss'],
})
export class AddEditCustomerComponent implements OnInit, OnDestroy {
  customerForm!: FormGroup;
  countryCodes: Array<any> = [];
  // customerData!: Customer;
  customerData: Customer = {
    billingAddress: {
      addressLine: 'sdfsdfsdfsf',
      landmark: 'NY square',
      pincode: '999999',
      city: 'llllllllll',
      country: 'India',
      state: 'lllllllllllllllll',
    },
    companyName: 'ppppppppp',
    contactDetails: { emailAddress: 'adb@adc.com', phoneNumber: '+91 999999999' },
    products: {
      iosApp: true,
      androidApp: false,
      api: false,
      trs: false,
      sdk: false,
      webapp: true,
      shopifyApp: true,
    },
    userInvite: {
      firstName: 'sdfssss',
      lastName: 'sssssssss',
      email: 'adb@adc.com',
      number: '0999999999',
      role: 'Admin',
    },
    websiteLink: 'www.xyz.com',
  };
  // stepper
  currentStep: number = 0;
  stepCountArray: Array<any> = [];
  addStepArray: Array<any> = [
    { number: 1, title: 'Add Customer Details', subTitle: 'Basic details' },
    {
      number: 2,
      title: 'Allocation of Products',
      subTitle: 'Allocate the products for the customer',
    },
    { number: 3, title: 'Invite User', subTitle: 'User will be given admin access by default' },
  ];

  editStepArray: Array<any> = [
    { number: 1, title: 'Edit Customer Details', subTitle: 'Edit Basic details' },
  ];

  // Products arrays
  productsArray: Array<any> = [
    { name: 'iOS Application', value: 'iosApp' },
    { name: 'Android Application', value: 'androidApp' },
    { name: 'API', value: 'api' },
    { name: 'TRS', value: 'trs' },
    { name: 'SDK', value: 'sdk' },
    { name: 'Web Application', value: 'webapp' },
    { name: 'Shopify Application', value: 'shopifyApp' },
  ];
  hasTrueValue!: boolean;
  constructor(
    private fb: FormBuilder,
    private customerStepperService: CustomerStepperService,
    private customerService: CustomerService,
    private router: Router,
    private alertService: AlertService,
    private dialogService: DialogService,
    private location: LocationStrategy
  ) {
    // Initialize the current step
    this.customerStepperService.currentStep$.subscribe((step) => {
      this.currentStep = step;
    });
  }

  ngOnInit(): void {
    this.stepCountArray = this.customerData ? this.editStepArray : this.addStepArray;
    this._initForm(this.customerData);
    this.getCountryCodeList();
  }

  private getCountryCodeList() {
    this.customerService.getCountryCode().subscribe((response: ICustomResponse) => {
      this.countryCodes = response.data;
    });
  }
  // Customer Form Initialize
  private _initForm(customerData?: any) {
    this.customerForm = this.fb.group({
      stepOne: this.fb.group({
        companyName: [
          customerData?.companyName ?? null,
          [Validators.required, Validators.minLength(2), Validators.maxLength(20)],
        ],
        websiteLink: [customerData?.websiteLink ?? null, [CustomValidators.websiteValidator]],
        billingAddress: this.createBillingAddressGroup(customerData?.billingAddress),
        contactDetails: this.createContactDetailsGroup(customerData?.contactDetails),
      }),
      stepTwo: this.fb.group({
        products: this.buildProductCheckboxes(),
      }),
      stepThree: this.fb.group({
        userInvite: this.createUserInviteGroup(),
      }),
    });

    console.log(this.customerForm.controls);
  }

  // Billing Address Form Group
  private createBillingAddressGroup(billingAddress?: any): FormGroup {
    return this.fb.group({
      addressLine: [
        billingAddress?.addressLine ?? null,
        [Validators.required, Validators.minLength(10), Validators.maxLength(50)],
      ],
      landmark: [
        billingAddress?.landmark ?? null,
        [Validators.minLength(5), Validators.maxLength(30)],
      ],
      pincode: [
        billingAddress?.pincode ?? null,
        [Validators.required, Validators.pattern(/^[1-9][0-9]{4,19}$/)],
      ], //PIN code could be either 5 or 20 digits long.
      city: [
        billingAddress?.city ?? null,
        [Validators.required, Validators.minLength(2), Validators.maxLength(30)],
      ],
      state: [
        billingAddress?.state ?? null,
        [Validators.required, Validators.minLength(2), Validators.maxLength(30)],
      ],
      country: [
        billingAddress?.country ?? null,
        [Validators.required, Validators.minLength(2), Validators.maxLength(30)],
      ],
    });
  }

  // Contact Details Form Group
  private createContactDetailsGroup(contactDetails?: any): FormGroup {
    return this.fb.group({
      emailAddress: [
        contactDetails?.emailAddress ?? null,
        [Validators.required, Validators.email, Validators.minLength(7), Validators.maxLength(254)],
      ],
      phoneNumber: [
        contactDetails?.phoneNumber ?? null,
        [
          Validators.required,
          // Validators.pattern(/^\(?([0-9]{3})\)?[-.●]?([0-9]{3})[-.●]?([0-9]{4})$/),
          Validators.minLength(7),
          Validators.maxLength(15),
        ],
      ],
    });
  }

  // Products Form Array
  private buildProductCheckboxes() {
    const arr = this.productsArray.map((product: any) => {
      return this.fb.control(false);
    });
    return this.fb.array(arr);
  }

  // User Invite Form Group
  private createUserInviteGroup(): FormGroup {
    return this.fb.group({
      firstName: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      lastName: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      email: [
        null,
        [Validators.required, Validators.email, Validators.minLength(7), Validators.maxLength(254)],
      ],
      number: [
        null,
        [
          Validators.required,
          // Validators.pattern(/^\(?([0-9]{3})\)?[-.●]?([0-9]{3})[-.●]?([0-9]{4})$/),
          Validators.minLength(7),
          Validators.maxLength(15),
        ],
      ],
      role: [null, [Validators.required]],
    });
  }

  hasTrueValueFunction(event: any) {
    console.log(event);
    this.hasTrueValue = event;
  }

  // Submit Customer Details
  submitCustomerDetails() {
    if (this.customerData) {
      this.updateCustomerDetails(this.customerForm.value);
    } else {
      this.addCustomer(this.customerForm);
    }
  }

  addCustomer(customer: any) {
    if (!customer.valid) return;

    const customerData = customer.value;
    const products = customerData.stepTwo.products;

    const productsFinalObj: any = {};

    this.productsArray.forEach((product, index) => {
      productsFinalObj[product.value] = products[index];
    });

    const customerObj: Customer = new Customer(
      customerData.stepOne.companyName,
      customerData.stepOne.websiteLink,
      customerData.stepOne.billingAddress,
      customerData.stepOne.contactDetails,
      productsFinalObj,
      customerData.stepThree.userInvite
    );

    this.customerService.saveCustomer(customerObj).subscribe(
      (response: ICustomResponse) => {
        console.log(response);
        this.alertService.success(response.message);
        this.customerStepperService.resetStep();
        this.router.navigate(['customers']);
      },
      (error) => {
        console.log(error);
        this.alertService.error(error.error.message);
      }
    );
  }

  updateCustomerDetails(customerDetails: any) {
    console.log(customerDetails.stepOne);
    this.customerService.updateCustomer(customerDetails._id, customerDetails.stepOne).subscribe(
      (response: ICustomResponse) => {
        console.log(response);
        this.alertService.success(response.message);
        this.customerStepperService.resetStep();
        this.router.navigate(['customers']);
      },
      (error) => {
        console.log(error);
        this.alertService.error(error.error.message);
      }
    );
  }

  // Go back to Previous Page
  goToCustomerList() {
    this.location.back();
  }

  // previous step function
  previousStep(): void {
    this.customerStepperService.updateStep(this.currentStep - 1);
  }

  // next step function
  nextStep(): void {
    this.customerStepperService.updateStep(this.currentStep + 1);
  }

  /* cancel form */
  cancelFormAndResetStepper(): void {
    const data = {
      title: 'Cancel !',
      icon: 'cancel',
      showCloseBtn: true,

      buttonGroup: [{ cssClass: 'btn-danger w-100', title: 'Cancel', value: true }],
    };

    this.dialogService
      .openModal(ConfirmComponent, {
        cssClass: 'modal-sm',
        context: {
          message:
            'Are you sure you want to cancel the process? Selected data will be deleted. This action cannot be undone.',
          data,
        },
      })
      .instance.close.subscribe((data: any) => {
        if (data) {
          console.log(data);
          this.customerStepperService.resetStep();
          this.customerForm.reset();
          this.router.navigate(['customers']);
        }
      });
  }

  ngOnDestroy(): void {
    this.customerStepperService.resetStep();
  }
}
