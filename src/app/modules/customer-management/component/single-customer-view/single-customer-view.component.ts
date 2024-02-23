import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from 'src/app/shared/service';

@Component({
  selector: 'app-single-customer-view',
  templateUrl: './single-customer-view.component.html',
  styleUrls: ['./single-customer-view.component.scss']
})
export class SingleCustomerViewComponent implements OnInit {

  customerId: any;
  customerHierarchy = [];
 
  constructor(private customerService: CustomerService,
  private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((res: any) => {
      this.customerId = res.id;
    });
 
    this.getCustomerHierarchy();
  }
 
  getCustomerHierarchy() {
    this.customerService.getCustomerHierachy()
      .subscribe((res: any ) => {
        this.customerHierarchy = res;
      })
  }
 
  selectCustomer() {
 
    let selectedCustomer = this.customerHierarchy.map((ele: any) => {return ele._id === this.customerId ? ele.children[0] : []});
 
    console.log(selectedCustomer);
 
    this.customerService.sendCustomer(selectedCustomer);
  }

}
