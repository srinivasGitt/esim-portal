import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { AlertService } from '../../service/alert.service';
import { CustomerService } from '../../service/customer.service';
import { DialogComponent } from '../../service/dialog';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  dialogRef: DialogComponent;
  data: any;
  customerForm: any;
  title: string = 'Add Customer';
  submitted = false;

  constructor(private customerService: CustomerService,
    private viewContainer: ViewContainerRef,
    private alertService: AlertService) {
    const _injector = this.viewContainer.injector;
    this.dialogRef = _injector.get<DialogComponent>(DialogComponent);
  }
  
  ngOnInit(): void {
    this.data = this.dialogRef.context.data;
    this.title = this.dialogRef.context.title;
    this.newCustomerForm();
  }
  
  newCustomerForm() {
    this.customerForm = new UntypedFormGroup({
      name: new UntypedFormControl(this.data?.name, [Validators.required]),
    });
  }

  get f() { return this.customerForm.controls; }


  submit() {
    this.submitted = true;
    if (this.customerForm.invalid) {
      return;
    }
    if (this.title === 'Edit Customer') {
      this.update();
    } else {
      this.createCustomer();
    }
  }


  update() {
    const formData = {
      name: this.customerForm.get('name').value,
    };
    console.log(formData);
    this.customerService.updateCustomer(this.data._id, formData)
    .subscribe((res: any) => {
      this.dialogRef.close.emit(res);
    }, err => {
      this.alertService.error(err.error.message);
    })
  }
    
  createCustomer() {
    this.customerService.createCustomer(this.customerForm.value)
    .subscribe((res: any) => {
      console.log(res);
      this.dialogRef.close.emit(res);
    }, err => {
      this.alertService.error(err.error.message);
    })
  }

  close(): void {
    this.dialogRef.close.emit();
  }

}
