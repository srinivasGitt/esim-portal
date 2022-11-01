import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
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
  constructor(
    private viewContainer: ViewContainerRef) {
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
      customerName: new UntypedFormControl(this.data?.customerName, [Validators.required]),
    });
  }

  submit() {
   
    this.close();
  }
  close(): void {
    this.dialogRef.close.emit(this.customerForm.value);
  }

}
