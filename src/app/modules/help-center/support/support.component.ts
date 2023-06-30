import { Component, OnDestroy, OnInit } from '@angular/core';
import { DialogService, AlertService } from 'src/app/shared/service';
import { PaginationInstance } from 'ngx-pagination';
import { SearchService } from 'src/app/shared/service/search/search.service';
import { ContactSupportInfoComponent } from 'src/app/shared/dialog/contact-support-info/contact-support-info.component';
import { SupportService } from 'src/app/shared/service/support.service';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent implements OnInit, OnDestroy {

  supportRequestList: any = [];

  paginateConfig: PaginationInstance = {
    id: 'supportListPagination',
    itemsPerPage: 20,
    currentPage: 1,
    totalItems: 0
  };

  inProgress: boolean = false;
  inSearch : boolean = false;
  selectedStatusValue!: string;
  copyText: string = 'Copy';

  constructor(private supportService: SupportService,
              private dialogService: DialogService,
              private alertService: AlertService,
              private _searchService: SearchService) { 
                _searchService.getResults().subscribe((results: any) => {
                  if(results) {
                    this.supportRequestList = results?.data
                    this.paginateConfig.totalItems = results?.count[0]?.totalCount;
                    this.paginateConfig.currentPage = 1;
                    this.inSearch = true;  
                  }
                })
              }
  ngOnInit(): void {
    this.getAllContactRequests();
  }

  getAllContactRequests() {
    this.inProgress = true;

    this.supportService.getAllContactSupportRequests('support')
    .subscribe(
      (res: any) => {
        this.supportRequestList = res.data;
        if(res.count) {
          this.paginateConfig.totalItems = res?.count[0]?.totalCount;
        }
        this.inProgress = false;
      }, (err: any) => {
        this.alertService.error(err.error.message, err.status);
        this.inProgress = false;
      }
    );
  }

  showInfo(contactRequest : any){
    this.dialogService.openModal(ContactSupportInfoComponent, { cssClass: 'modal-sm', context: {data: contactRequest, title: 'Support Info'} })
    .instance.close.subscribe((data: any) => {
      if(data){
        this.getAllContactRequests()
      }
    },
    (error : any) =>{

    });
  }

  onSelect(value: string, data: any) {    
    const status = value 
    this.supportService.updateContactSupportRequestStatus(data._id, status).subscribe((res: any) => {
      if(res) {
        this.alertService.success(res.message);
        this.getAllContactRequests()
      }
    },
    (err : any) =>{
      this.alertService.error(err.error.message, err.status);
      this.inProgress = false;
    })
  }


  // Copy user email
  copyToClipboard(event: MouseEvent, email: string | undefined) {
    event.preventDefault();

    if(!email) {
      return;
    }
    
    navigator.clipboard.writeText(email);
  }

  ngOnDestroy(): void {
    this.inSearch = false
    this._searchService.searchedTerm = ''
  }

}
