import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CustomerService, UsersService, AlertService, DashboardService } from '../../service';
import { NavigationEnd, Router } from '@angular/router';
import { LocalStorageService } from '../../service/local-storage.service';
import { FormBuilder, FormGroup, NgForm, NgModel } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, pluck, switchMap } from 'rxjs/operators';
import { SearchService } from '../../service/search/search.service';
declare var $: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, AfterViewInit {
  isDarkTheme = false;
  screenMode:any;
  parentCustomer: any;
  customerList: any = [];
  userDetails: any;
  showSearch: boolean = true;
  routeUrl!: string;

  @ViewChild('searchForm',{static: false}) searchForm!: NgModel;
  initValue: string = '';
  searchform!: FormGroup;
  urlList = ['/', '/reports', '/customer-management', '/user-management', '/setting', '/help-center']
  constructor(private customerService: CustomerService,
              private dashboardService: DashboardService,
              private alertService : AlertService,
              private usersService: UsersService,
              public router: Router,
              private _localStorage: LocalStorageService,
              private _searchService: SearchService, private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    
      // show/hide search box
      router.events.subscribe((route) => {
        if(route instanceof NavigationEnd) {
        this.routeUrl = route.url
        if(this.urlList.includes(route.url)) {
          this.showSearch = false;
        } else {
          this.showSearch = true;
        }
        this.searchform?.reset()
      }
    })
    usersService.getCurrentUser().subscribe(result => {
      this.userDetails = result;
    });
  }

  ngOnInit(): void { 
    
    if (!this._localStorage.getToken()) {
      this.router.navigate(['/signin']);
    }else{
      // this.getAllCustomer();
    }
    this.formInit()
  }

  formInit(): void {
    this.searchform = this.fb.group({
        searchTerm: ['']
    })
  }

  ngAfterViewInit() {
    
    // Search Input Logic
    /*
    if(this.searchForm?.valueChanges) {
      const formValue = this.searchForm.valueChanges
      formValue?.pipe(
        filter(() => !this.searchForm.invalid),
        pluck('searchTerm'),
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(data => this._searchService.getSearchResult(this.routeUrl, data))
      )
      .subscribe(res => {
        this._searchService.setResults(res)
      })
    }
    */
    if(!this.urlList.includes(this.routeUrl)) {
      this.searchform.controls['searchTerm'].valueChanges.pipe(
          debounceTime(500),
          distinctUntilChanged(),
          switchMap(data => this._searchService.getSearchResult(this.routeUrl, data))
          ).subscribe(res => {
            this.cdr.detectChanges()
            this._searchService.setResults(res)
          })
      }
    }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    this.dashboardService.setAppTheme(this.isDarkTheme);
    this._localStorage.setTheme(this.isDarkTheme)
    $('#body').toggleClass('darkMode');
  }

  getAllCustomer() {
    this.customerService.customers()
     .subscribe(
      (data: any) => {
        this.parentCustomer = data.name;       //parent customer name
        this.customerList = data.childCustomer; //anuyat under child
      }, err => {
        this.alertService.error(err.error.message);
      }
   );
  }

  signout(){
    this._localStorage.removeToken()
  }

}
