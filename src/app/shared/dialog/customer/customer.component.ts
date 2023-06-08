import { Component, OnInit, ViewContainerRef, } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { AlertService } from '../../service/alert.service';
import { CustomerService } from '../../service/customer.service';
import { DialogComponent } from '../../service/dialog';
import { FormControl, FormGroup,FormBuilder, } from '@angular/forms';

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
  inProgress: boolean = false;
  
  constructor(private customerService: CustomerService,
    private viewContainer: ViewContainerRef,
    private alertService: AlertService,
    private fb:FormBuilder) {
    const _injector = this.viewContainer.injector;
    this.dialogRef = _injector.get<DialogComponent>(DialogComponent);
  }
  
  Provider= [
    {id: "1", name: "Telna", image: "/assets/icons/telna.svg"},
    {id: "2", name: "POD", image: "/assets/icons/pod.svg"},
    {id: "3", name: "pccw", image: "/assets/icons/pccw.png"},
  ];

  ngOnInit(): void {
    this.data = this.dialogRef.context.data;
    this.title = this.dialogRef.context.title;
    if(this.title == 'Edit Customer' && this.data?._id){
      this.getCustomerDetails();
    }
    this.newCustomerForm();
  }
  
  newCustomerForm() {
    this.customerForm = new UntypedFormGroup({
      name: new UntypedFormControl(this.data?.name, [Validators.required]),
      smdp: new UntypedFormControl(this.data?.smdp, [Validators.required] ),
    });
  }

  getCustomerDetails(){
    this.customerService.getSingleCustomer(this.data?._id).subscribe(
      (result : any) => {
        switch (result[0].smdp) {
          case 'telna':
          case 'Telna':
              result[0].smdp = 'Telna'
              break;
          case 'pod':
          case 'POD':
              result[0].smdp = 'POD'
              break;
          case 'pccw':
          case 'PCCW':
              result[0].smdp = 'pccw'
              break;
        }
        if(result?.length > 0){
          this.f.name.setValue(result[0].name);
          // this.f.smdp.setValue(result[0].providers.map((p : any) => p.smdp));
          this.f.smdp.setValue(result[0].smdp);
        }
      }
    )
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
    this.inProgress = true;
    const formData = {
      name: this.customerForm.get('name').value,
      smdp: this.customerForm.get('smdp').value,
    };

    this.customerService.updateCustomer(this.data._id, formData)
    .subscribe((res: any) => {
      this.dialogRef.close.emit(res);
      this.inProgress = false;
    }, err => {
      this.alertService.error(err.error.message, err.status);
      this.inProgress = false;
    })
  }
    
  createCustomer() {
    this.inProgress = true;
    this.customerService.createCustomer(this.customerForm.value)
    .subscribe((res: any) => {
      this.dialogRef.close.emit(res);
      this.inProgress = false;
    }, err => {
      this.alertService.error(err.error.message, err.status);
      this.inProgress = false;
    })
  }

  close(): void {
    this.dialogRef.close.emit();
  }

}
