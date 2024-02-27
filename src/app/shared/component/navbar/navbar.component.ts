import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgModel } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { AlertService, CustomerService, DashboardService, UsersService } from '../../service';
import { LocalStorageService } from '../../service/local-storage.service';
import { SearchService } from '../../service/search/search.service';
declare let $: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, AfterViewInit {
  isDarkTheme = false;
  screenMode: any;
  parentCustomer: any;
  customerList: any = [];
  userDetails: any;
  showSearch: boolean = true;
  routeUrl!: string;
  placeHolder: string = '';

  tooltip = 'Need Assistance?';
  supportLink = 'https://support.glowingbud.com/';

  @ViewChild('searchForm', { static: false }) searchForm!: NgModel;
  initValue: string = '';
  searchform!: FormGroup;
  urlList = [
    '/',
    '/reports',
    '/setting',
    '/loyalty-point-program',
    '/reports/revenue',
    '/reports/data-usage',
    '/reports/subscriber',
    '/reports/subscription',
  ];

  constructor(
    private customerService: CustomerService,
    private dashboardService: DashboardService,
    private alertService: AlertService,
    private usersService: UsersService,
    public router: Router,
    private _localStorage: LocalStorageService,
    private _searchService: SearchService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.formInit();

    // show/hide search box
    router.events.subscribe((route) => {
      if (route instanceof NavigationEnd) {
        this.routeUrl = route.url;
        const routeArray = this.routeUrl;
        if (this.urlList.includes(route.url)) {
          this.showSearch = false;
        } else {
          if ((routeArray.match(/\//g) || []).length > 1 && route.url === 'help-center' ) {
            this.showSearch = false;
          } else {
            this.showSearch = true;
            this.placeHolder = this.definePlaceholder(this.routeUrl);
          }
        }
        this.searchform?.reset();

        if (!this.urlList.includes(this.routeUrl)) {
          this.searchform
            ?.get('searchTerm')
            ?.valueChanges.pipe(
              debounceTime(500),
              distinctUntilChanged(),
              switchMap((data) => {
                if (data !== null) {
                  return this._searchService.getSearchResult(this.routeUrl, data);
                } else {
                  return [];
                }
              })
            )
            .subscribe((res) => {
              console.log(res);
              this.cdr.detectChanges();
              this._searchService.setResults(res);
            });
        }
      }
    });
    usersService.getCurrentUser().subscribe((result) => {
      this.userDetails = result;
    });
  }

  ngOnInit(): void {
    if (!this._localStorage.getToken()) {
      this.router.navigate(['/signin']);
    } else {
      // this.getAllCustomer();
    }
    const theme = this._localStorage.getTheme();
    theme == 'dark' ? (this.isDarkTheme = true) : (this.isDarkTheme = false);
    this.dashboardService.setAppTheme(this.isDarkTheme);
    this._localStorage.setTheme(this.isDarkTheme);
    if (this.isDarkTheme) $('#body').toggleClass('darkMode');
    // this.formInit()
  }

  formInit(): void {
    this.searchform = this.fb.group({
      searchTerm: [''],
    });
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
    if (!this.urlList.includes(this.routeUrl)) {
      this.searchform.controls['searchTerm'].valueChanges
        .pipe(
          debounceTime(500),
          distinctUntilChanged(),
          switchMap((data) => this._searchService.getSearchResult(this.routeUrl, data))
        )
        .subscribe((res) => {
          this.cdr.detectChanges();
          this._searchService.setResults(res);
        });
    }
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    this.dashboardService.setAppTheme(this.isDarkTheme);
    this._localStorage.setTheme(this.isDarkTheme);
    $('#body').toggleClass('darkMode');
  }

  getAllCustomer() {
    this.customerService.customers().subscribe(
      (data: any) => {
        this.parentCustomer = data.name; //parent customer name
        this.customerList = data.childCustomer; //anuyat under child
      },
      (err) => {
        this.alertService.error(err.error.message);
      }
    );
  }

  private definePlaceholder(urlEndPoint: any): string {
    const splittedUrl = urlEndPoint.split('/');
    const first = splittedUrl[1];

    const mappings: any = {
      customers: 'Search by Customer Name',
      'user-management': 'Search by User Name or User Email ID',
      agent: 'Search by Agent Name or Email ID',
      plans: 'Search by Plan Name or IMSI',
      subscribers: 'Search by Display Name or User Email ID',
      subscriptions: 'Search by User Email ID or Plan Name',
      inventory: 'Search by ICCID or IMSI',
      'help-center': 'Search by Name or User Email ID',
    };
    const result = mappings[first] || 'Search';
    return result;
  }

  signout() {
    this._localStorage.clearStorage();
  }
}
