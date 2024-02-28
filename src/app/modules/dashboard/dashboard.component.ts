import { Component, OnInit } from '@angular/core';
import { CustomerService, LocalStorageService } from 'src/app/shared/service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit{
  isCustomerSelected = false;
  isSuperAdmin: boolean = true;

  constructor(private customerService: CustomerService,
    private localStorage: LocalStorageService) {}

  ngOnInit(): void {
    this.isCustomerSelected = !this.localStorage.getSelectedCustomer() || this.localStorage.getSelectedCustomer() === 'false' ? false : true;

    this.customerService.getCustomer()
      .subscribe(res => {
        if(res) {
          console.log(res);
          this.isCustomerSelected = true;
        } else {
          this.isCustomerSelected = false;
        }
      });
  }
}
