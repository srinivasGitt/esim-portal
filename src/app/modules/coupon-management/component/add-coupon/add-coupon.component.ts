import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DialogComponent } from 'src/app/shared/service/dialog';

@Component({
  selector: 'app-add-coupon',
  templateUrl: './add-coupon.component.html',
  styleUrls: ['./add-coupon.component.scss']
})
export class AddCouponComponent implements OnInit {

  couponForm = new FormGroup({
    stepOne: new FormGroup({
      code: new FormControl(''),
      discountType: new FormControl('fixed'),
      discountValue: new FormControl('')
    }),
    stepTwo: new FormGroup({
      startDate: new FormControl(new Date()),
      endDate: new FormControl(new Date()),
      total: new FormControl(''),
      minPurchaseValue: new FormControl(''),
      maxPurchaseValue: new FormControl(''),
      useType: new FormControl(''),
      totalUse: new FormControl(''),
      applicableType: new FormControl(''),
      applicableValue: new FormControl('')
    })
  })

  dialogRef: DialogComponent;
  currentDate = new Date().toISOString().slice(0, 10);

  constructor(private viewContainer: ViewContainerRef) { 
    const _injector = this.viewContainer.injector;
    this.dialogRef = _injector.get<DialogComponent>(DialogComponent);
  }

  ngOnInit(): void {
  }

  submit() {

  }
  
  /* close modal */
  close(): void {
    // this.data.amount = 343;
    this.dialogRef.close.emit(false);
  }
  
}
