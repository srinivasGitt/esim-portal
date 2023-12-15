import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';
import { combineLatest } from 'rxjs';
import { CouponManagementService } from 'src/app/modules/coupon-management/service/coupon-management.service';
import { AlertService } from 'src/app/shared/service';

@Component({
  selector: 'app-step-three',
  templateUrl: './step-three.component.html',
  styleUrls: ['./step-three.component.scss']
})
export class StepThreeComponent implements OnInit {

  @Input() formGroupName!: string;
  @Input() planList!: Array<any>;
  @Input() regionList!: Array<any>;
  @Input() countryList!: Array<any>;
  list: Array<any> = [];
  form!: FormGroup;
  
  placeholderText: string = 'Search for plans / Multiple plans can be selected';
  @ViewChild('ngSelectComponent') ngSelectComponent!: NgSelectComponent;
  
  // Flags
  isCountry: boolean = false;
  isRegion: boolean = false;
  isPlan: boolean = false;

  constructor(private rootFormGroup: FormGroupDirective, 
              private couponService: CouponManagementService, 
              private alertService: AlertService,
              private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.form = this.rootFormGroup.control.get(this.formGroupName) as FormGroup;
  }

  ngAfterContentChecked(): void {
    // Changing the placeholder based on the radio selection on Coupon Form Step Three
    this.form.get('applicableType')?.valueChanges.subscribe((data: any) => {     

      const configMap: any = {
        'plan': {
          placeholderText: 'Search for plans / Multiple plans can be selected',
          list: this.planList,
          isPlan: true,
          isRegion: false,
          isCountry: false,
        },
        'region': {
          placeholderText: 'Search for regions / Multiple regions can be selected',
          list: this.regionList,
          isPlan: false,
          isRegion: true,
          isCountry: false,
        },
        'country': {
          placeholderText: 'Search for countries / Multiple countries can be selected',
          list: this.countryList,
          isPlan: false,
          isRegion: false,
          isCountry: true,
        }
      };
      
      const config = configMap[data];
      
      if (config) {
        this.updateView(config);
      } else {
        // Handle default case if needed
      }

      this.ngSelectComponent.clearModel(); 
    });

    this.cd.detectChanges();
  }

  private updateView(config: any): void {
    this.placeholderText = config.placeholderText;
    this.list = config.list;
    this.isPlan = config.isPlan;
    this.isRegion = config.isRegion;
    this.isCountry = config.isCountry;
  }

  displayList(items: any){
    return items.map((country: any) => country.name).slice(2).join(', ');
  }

 
}
