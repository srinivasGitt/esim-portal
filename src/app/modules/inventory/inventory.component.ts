import { Component, OnInit } from '@angular/core';
import { QrCodePopupComponent } from 'src/app/shared/dialog/qr-code-popup/qr-code-popup.component';
import { DialogService } from 'src/app/shared/service/dialog';
import { InventoryService } from 'src/app/shared/service/inventory.service';
import { PlansService } from 'src/app/shared/service/plans.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {
  inventory: any = [];
  constructor(private inventoryService: InventoryService,
              private dialogService: DialogService) { }
  ngOnInit(): void {
    this.getInventory();
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
        console.log(data);
        this.inventory = data;

      }, err => {
        console.log(err);
      }
    );

  }

  openQRCODEpopup(index: number) {
    this.dialogService.openModal(QrCodePopupComponent, { cssClass: 'modal-md', context: {data: this.inventory[index], title: 'Profile Information'} })
      .instance.close.subscribe((data: any) => {
        console.log(data);
        // let vm  = this;
        // vm.plansList.push(data);
        }, err => {
          console.log(err);
        });
  }
}
