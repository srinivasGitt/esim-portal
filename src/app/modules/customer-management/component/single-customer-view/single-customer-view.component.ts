import { Component, OnInit } from '@angular/core';
import { CustomerService } from 'src/app/shared/service';

@Component({
  selector: 'app-single-customer-view',
  templateUrl: './single-customer-view.component.html',
  styleUrls: ['./single-customer-view.component.scss']
})
export class SingleCustomerViewComponent implements OnInit {

  constructor(private customerService: CustomerService) { }

  ngOnInit(): void {
  }

  selectCustomer() {
    this.customerService.sendCustomer('customerSelected');
  }

}
