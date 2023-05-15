import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { DialogComponent } from '../../service/dialog/dialog.component';

@Component({
  selector: 'app-inventory-info',
  templateUrl: './inventory-info.component.html',
  styleUrls: ['./inventory-info.component.scss']
})
export class InventoryInfoComponent implements OnInit {
  
  dialogRef: DialogComponent;
  inventoryDetails: any;
  copyText: string = 'Copy'

  constructor(private viewContainer: ViewContainerRef
  ) {
    const _injector = this.viewContainer.injector;
    this.dialogRef = _injector.get<DialogComponent>(DialogComponent);}

  ngOnInit(): void {
    this.inventoryDetails = this.dialogRef.context.data;
  }

  // Copy user email
  copyToClipboard(event: MouseEvent, email: string | undefined) {
    event.preventDefault();
    
    if(!email) {
      return;
    }
    
    navigator.clipboard.writeText(email);
  }
  
  close(): void {
    this.dialogRef.close.emit();
  }
}
