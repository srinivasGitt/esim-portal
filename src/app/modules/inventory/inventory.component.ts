import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { QrCodePopupComponent } from 'src/app/shared/dialog/qr-code-popup/qr-code-popup.component';
import { DialogService } from 'src/app/shared/service/dialog';
import { InventoryService } from 'src/app/shared/service/inventory.service';
import { ProfileLogComponent } from 'src/app/shared/dialog/profile-log/profile-log.component';
import { AlertService } from 'src/app/shared/service/alert.service';
import { DashboardService } from 'src/app/shared/service/dashboard.service';
import { UploadInventoryComponent } from 'src/app/shared/dialog/upload-inventory/upload-inventory.component';
import { DownloadSampleFileComponent } from 'src/app/shared/dialog/download-sample-file/download-sample-file.component';
import { PaginationInstance } from 'ngx-pagination';
import { InventoryInfoComponent } from 'src/app/shared/dialog/inventory-info/inventory-info.component';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {
  
  inventories: any = [];
  data: any;
  totalProfiles: any;
  paginateConfig: PaginationInstance = {
    id: 'inventoryListPagination',
    itemsPerPage: 20,
    currentPage: 1
  };
  filterConfig: any = {
    searchTerm: '',
    searchKey: 'name',
    filterBy: { key : 'createdAt', type: 'date', value: undefined }
  };

  constructor(private inventoryService: InventoryService,
              private dialogService: DialogService,
              private alertService : AlertService) { }

  ngOnInit(): void {
    this.getInventory()
  }

  
  getInventory() {
    this.inventoryService.listInventory()
    .subscribe(
      (data: any) => {
        this.inventories = data;
        this.paginateConfig.totalItems = data?.length;
      }, err => {
        this.alertService.error(err.error.message);
      }
    );
  }

  uploadFile() {
    this.dialogService.openModal(UploadInventoryComponent, { cssClass: 'modal-sm', context: {data: {}, title: 'Upload Inventory'} })
    .instance.close.subscribe((data: any) => {
      if(data == 'download'){
        this.downloadModal()
      }
    });
  }

  downloadModal() {
    this.dialogService.openModal(DownloadSampleFileComponent, { cssClass: 'modal-sm', context: {data: {}, title: 'Download Sample File'} })
    .instance.close.subscribe((data: any) => {
      if(data){
        
        
      }
    });
  }

  showInventory(inventory: any){
    this.dialogService.openModal(InventoryInfoComponent, { cssClass: 'modal-sm', context: {data: inventory} })
    .instance.close.subscribe((data: any) => {
      
    }, err => {

    })
  }
}
