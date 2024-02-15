import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { RegionsService } from '../../service';

@Component({
  selector: 'app-mobile-number-input',
  templateUrl: './mobile-number-input.component.html',
  styleUrls: ['./mobile-number-input.component.scss']
})
export class MobileNumberInputComponent implements OnInit {

  countryList: Array<any> = [
    {'name': 'India', 'dial_code': '+91'},
    {'name': 'USA', 'dial_code': '+1'},
  ];

  country: FormControl = new FormControl('');
  phoneNumber: FormControl = new FormControl('');
  countryDialCode: string = '+91';
  @Input() inputControl!: any;
  constructor(private regionService: RegionsService) {}

  ngOnInit(): void {
    this.regionService.getCountries().subscribe(
      (result : any) => {
      }
    );
    if(this.inputControl?.value?.trim() != ''){
      const phoneNumber = this.inputControl?.value?.split(" ") || [];
      if(phoneNumber.length == 2){
        this.countryDialCode = phoneNumber[0];
        this.phoneNumber.setValue(phoneNumber[1])
      } else {
        this.phoneNumber.setValue(this.inputControl.value);
      }
    }
  }

  trackCountries(index: any, item : any) {
    return item._id;
  }

  setDialCode(country : any){
    this.countryDialCode = country.dial_code;
    if(this.phoneNumber?.value?.trim() != ''){
      this.inputControl.setValue(`${this.countryDialCode} ${this.phoneNumber.value}`);
    }
  }

  handleEvent(event : any){
    this.inputControl.markAsTouched()
    if(this.phoneNumber?.value?.trim() != ''){
      this.inputControl.setValue(`${this.countryDialCode} ${this.phoneNumber.value}`);
    }
  }
}
