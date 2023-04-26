import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CustomerService, UsersService, AlertService, DashboardService } from '../../service';
import { NavigationEnd, Router } from '@angular/router';
import { LocalStorageService } from '../../service/local-storage.service';
import { NgForm } from '@angular/forms';
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

  @ViewChild('searchForm',{static: false}) searchForm!: NgForm;
  initValue: string = '';

  constructor(private customerService: CustomerService,
              private dashboardService: DashboardService,
              private alertService : AlertService,
              private usersService: UsersService,
              public router: Router,
              private _localStorage: LocalStorageService,
              private _searchService: SearchService) {
    
      // show/hide search box
      router.events.subscribe((route) => {
        if(route instanceof NavigationEnd) {
        this.routeUrl = route.url
        if(route.url == "/" || route.url == "/reports" || route.url == "/customer-management" || route.url == "/user-management") {
          this.showSearch = false;
        } else {
          this.showSearch = true;
        }
        // this.searchForm.reset()
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
  }

  ngAfterViewInit() {
    
    // Search Input Logic
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

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    this.dashboardService.setAppTheme(this.isDarkTheme);
    this._localStorage.setTheme(this.isDarkTheme)
    $('#body').toggleClass('lightMode');
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

  // reset(){
  //   this.searchForm.reset()
  //   this._searchService._searchResults$.next(null)
  //   this._searchService._searchResults$.complete()
  // }
  

}
