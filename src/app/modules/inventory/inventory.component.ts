import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { QrCodePopupComponent } from 'src/app/shared/dialog/qr-code-popup/qr-code-popup.component';
import { DialogService } from 'src/app/shared/service/dialog';
import { InventoryService } from 'src/app/shared/service/inventory.service';
import { ProfileLogComponent } from 'src/app/shared/dialog/profile-log/profile-log.component';
import { AlertService } from 'src/app/shared/service/alert.service';
import { DashboardService } from 'src/app/shared/service/dashboard.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {
  inventory: any = [];
  data: any;
  totalProfiles: any;
  constructor(private inventoryService: InventoryService,
              private dialogService: DialogService,
              private alertService : AlertService,
              private dashboardService: DashboardService) { 
              }
  ngOnInit(): void {
    this.getInventory();
    this.totalProfileCount();
  }

  // createPlan() {
  //   this.inventoryService.createPlan({})
  //   .subscribe( (data: any) => {
  //     console.log(data);
  //   }, err => {
  //     console.log(err);
  //   });
  // }
  getInventory() {
    this.inventoryService.listInventory()
    .subscribe(
      (data: any) => {
        
        this.inventory = data;

      }, err => {
        this.alertService.error(err.error.message);
      }
    );

  }

  openQRCODEpopup(index: number) {
    this.dialogService.openModal(QrCodePopupComponent, { cssClass: 'modal-md', context: {data: this.inventory[index], title: 'Profile Information'} })
      .instance.close.subscribe((data: any) => {
       
        // let vm  = this;
        // vm.plansList.push(data);
        }, err => {
          this.alertService.error(err.error.message);
        });
  }

  openProfileLog(profileInfo: any){
    this.dialogService.openModal(ProfileLogComponent, {cssClass: 'modal-xl', context: {data: profileInfo, title: 'Profile Log'}})
    .instance.close.subscribe((data: any) => {

    }, err => {
      this.alertService.error(err.error.message);
    });
  }

  totalProfileCount() {
    this.dashboardService.getProfiles()
      .subscribe((data: any) => {
        this.totalProfiles = data;
      })
  }
}
